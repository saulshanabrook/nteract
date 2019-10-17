import { KernelMessage } from "@jupyterlab/services";
import * as base from "@jupyter-widgets/base";
import * as controls from "@jupyter-widgets/controls";
import {
  DOMWidgetView,
  WidgetModel,
  WidgetView,
  DOMWidgetModel
} from "@jupyter-widgets/base";
import { WidgetComm } from "./widget-comms";
import { Dispatch } from "redux";
import { connect } from "react-redux";

export class WidgetManager extends base.ManagerBase<DOMWidgetView> {
  el: HTMLElement;
  dispatch: Dispatch;

  constructor(el: HTMLElement, dispatch: Dispatch) {
    super();
    this.el = el;
    this.dispatch = dispatch;
  }

  loadClass(className: string, moduleName: string, moduleVersion: string): any {
    return new Promise(function(resolve, reject) {
      if (moduleName === "@jupyter-widgets/controls") {
        resolve(controls);
      } else if (moduleName === "@jupyter-widgets/base") {
        resolve(base);
      } else {
        return Promise.reject(
          `Module ${moduleName}@${moduleVersion} not found`
        );
      }
    }).then(function(module: any) {
      if (module[className]) {
        return module[className];
      } else {
        return Promise.reject(
          `Class ${className} not found in module ${moduleName}@${moduleVersion}`
        );
      }
    });
  }

  display_view(
    msg: KernelMessage.IMessage,
    view: base.DOMWidgetView,
    options: any
  ): Promise<base.DOMWidgetView> {
    return Promise.resolve(view);
  }

  _get_comm_info() {
    return Promise.resolve({});
  }

  _create_comm(comm_target_name: string,
    model_id: string,
    data?: any,
    metadata?: any,
    buffers?: ArrayBuffer[] | ArrayBufferView[]) {
    console.log("_create_comm called");
    return Promise.resolve(new WidgetComm({} as Dispatch, model_id, this.comm_target_name, "not used"));
  }
}