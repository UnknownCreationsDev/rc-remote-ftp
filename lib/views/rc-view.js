'use babel';

import { $, ScrollView } from 'atom-space-pen-views';

class RcView extends ScrollView {
  static content() {
    return this.div({ class: 'remote-ftp-view tool-panel' },
     () => {
      this.ol({
        class: 'ftptree-view full-menu list-tree has-collapsable-children focusable-panel',
        tabindex: -1,
        outlet: 'list',
      });
    });
  }

  initialize(storage) {
    super.initialize(storage);
    this.storage = storage;

    this.list.append('<div class="remote-ftp-offline-inner"><center><h3> You are currently offline! </h3><center></div>')
    this.list.show();

    this.getTitle = () => 'RoleCatcher';

    if (this.storage.data.options.treeViewShow) this.attach();

  }

  serialize() { return this.storage.data; }

  getDockElems() {
    const currentSide = this.storage.data.options.treeViewSide.toLowerCase();
    const currentDock = atom.workspace.paneContainers[currentSide];

    if (typeof currentDock !== 'object') return false;

    const activePane = currentDock.getPanes()[0];

    return { currentSide, currentDock, activePane };
  }

  onDidCloseItem() { this.detach(); }

  attach() {
    const dockElems = this.getDockElems();

    if (!dockElems.activePane) return;

    this.panel = dockElems.activePane.addItem(this);

    if (!dockElems.currentDock.isVisible() && this.storage.data.options.treeViewShow)
      dockElems.currentDock.toggle();


    atom.workspace.onDidDestroyPaneItem(({ item }) => {
      if (item === this.panel)
        this.onDidCloseItem(this.panel);
    });
  }

  attached() { this.storage.data.options.treeViewShow = true; }

  detach(...args) {
    super.detach(...args);

    if (this.panel) {
      if (typeof this.panel.destroy === 'function') {
        this.panel.destroy();
      } else if (typeof atom.workspace.paneForItem === 'function') {
        if (typeof atom.workspace.paneForItem(this.panel) !== 'undefined') {
          atom.workspace.paneForItem(this.panel).destroyItem(this.panel, true);
        }
      }

      this.panel = null;
    }

    this.storage.data.options.treeViewShow = false;
  }

  toggle() {
    if (typeof this.panel !== 'undefined' && this.panel !== null)
      this.detach();
    else
      this.attach();
  }

}

export default RcView;
