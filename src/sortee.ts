import { Dictionary, indexOf } from "lodash";
import groupBy from "lodash/groupBy";
import ExtensionExecOption from "./extension_exec_option";

(function (window: Window, throw_errors: boolean = false) {
  /**
   * Groups extensions by their scope and execution option
   * @param extensions array of extensions
   * @returns object containing named extension groups
   */
  function group_extensions_by_scope_and_exec_options(extensions: Extension[]): Dictionary<Extension[]> {
    const by_scope = groupBy(extensions, (extension) => {
      let { scope, advExecOption } = extension;
      if (advExecOption.endsWith("_ro")) {
        switch (advExecOption) {
          case ExtensionExecOption.BEFORE_LOAD_RULES_RUN_ONCE:
            advExecOption = ExtensionExecOption.BEFORE_LOAD_RULES;
            break;
          case ExtensionExecOption.AFTER_LOAD_RULES_RUN_ONCE:
            advExecOption = ExtensionExecOption.AFTER_LOAD_RULES;
            break;
        }
      }
      return [scope, advExecOption].join("_");
    });
    return by_scope;
  }

  /**
   * extracts sort indexes from the extension list so they can be reassigned in
   * new order
   * @param extensions array of extensions
   * @returns sorted array of sorting indexes within provided extensions
   */
  function get_available_sort_indexes(extensions: Extension[]): number[] {
    return extensions.map((extension) => extension.sort).sort((a, b) => a - b);
  }

  /**
   * Sorts the array with extensions in place. Returned array is the same array
   * that have been provided to allow chaining.
   * @param extensions array of extensions
   * @param fn extension comparison function
   * @returns sorted array of extensions
   */
  function sort_extensions(extensions: Extension[], fn: (a: Extension, b: Extension) => number): Extension[] {
    const sorted_extensions = extensions;
    sorted_extensions.sort(fn);
    return sorted_extensions;
  }

  /**
   * Assigns sort order indexes to extensions.
   * Returns load order changes for applied extensions that can be used to
   * inform user interface that the load order have been applied
   * @param sort_indexes array of sort indexes to assign the extensions to
   * @param extensions SORTED array of extension
   * @returns array with load order changes applied
   */
  function assign_sort_order(sort_indexes: number[], extensions: Extension[]): LoadOrderChange[] {
    if (sort_indexes.length !== extensions.length) {
      console.error(`[sortee] not enough available sort indexes for extensions. sort indexes not reassigned`);
      if (throw_errors)
        throw new Error(`[sortee] not enough available sort indexes for extensions. sort indexes not reassigned`);
      return [];
    }
    const changes: LoadOrderChange[] = [];
    for (const i in sort_indexes) {
      if (extensions[i].sort === sort_indexes[i]) continue;
      extensions[i].sort = sort_indexes[i];
      changes.push({ item: extensions[i], changed: ["sort_updated"] });
    }

    return changes;
  }

  /**
   * Sorts tealium extensions by a comparison function.
   * The comparison function receives two parameters with extension object
   * @param comparison_fn Function to compare two extensions
   */
  function Sortee(comparison_fn: (a: Extension, b: Extension) => number) {
    const extensions = Object.values(window.utui.data.customizations);
    const grouped_extensions = group_extensions_by_scope_and_exec_options(extensions);

    let changes: LoadOrderChange[] = [];
    for (const group in grouped_extensions) {
      console.debug(`[sortee] Sorting group ${group}`);
      const extensions = grouped_extensions[group];
      const available_indexes = get_available_sort_indexes(extensions);
      sort_extensions(extensions, comparison_fn);
      changes = [...changes, ...assign_sort_order(available_indexes, extensions)];
    }
    if (changes.length > 0) {
      console.debug(`[sortee] List of changes:`, changes);

      window.utui.util.pubsub.publish(window.utui.constants.extensions.SORTED, changes);
    }
  }
  window.Sortee = Sortee;
})(window, false);
