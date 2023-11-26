import { RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  PluginSpec,
  PluginValue,
  ViewPlugin,
  ViewUpdate
} from "@codemirror/view";
import AuleWidget from "./widget";

class AuleBubblePlugin implements PluginValue {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }

  destroy() {}

  buildDecorations(view: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    builder.add(0, 0, Decoration.widget({widget: new AuleWidget}))
    return builder.finish();
  }
}

const pluginSpec: PluginSpec<AuleBubblePlugin> = {
  decorations: (value: AuleBubblePlugin) => value.decorations,
};

export const auleBubblePlugin = ViewPlugin.fromClass(
  AuleBubblePlugin,
  pluginSpec
);