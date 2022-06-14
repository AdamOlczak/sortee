// declare global {
interface Window {
  Sortee: (comparison_fn: (a: Extension, b: Extension) => number) => void;
  utui: {
    data: {
      customizations: Extension[];
    };
    util: {
      pubsub: {
        publish: (message: string, data: any) => void;
      };
    };
    constants: {
      extensions: {
        SORTED: "updated_extension_order";
      };
    };
  };
}
// }

type TagID = string;
type TagTypeID = string;

interface Extension {
  _id: TagID;
  title: string;
  sort: number;
  scope: ExtensionScope | TagID;
  advExecOption: ExtensionExecOption;
  id: TagTypeID;
}

interface LoadOrderChange {
  item: Extension;
  changed: "sort_updated"[];
}
