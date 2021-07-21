'use babel';

import fs from 'fs-plus';
import path from 'path';
import { Emitter } from 'event-kit';

import { unableToSaveFile } from './notifications'

class File {
  constructor(params) {
    this.emitter = new Emitter();

    this.parent = null;
    this.name = '';
    this.client = null;
    this.isSelected = false;
    this.status = 0;
    this.size = 0;
    this.date = null;
    this.type = null;
    this.original = null;

    Object.keys(params).forEach((n) => {
      if (Object.prototype.hasOwnProperty.call(this, n)) {
        this[n] = params[n];
      }
    });

    const ext = path.extname(this.name);

    if (fs.isReadmePath(this.name)) {
      this.type = 'readme';
    } else if (fs.isCompressedExtension(ext)) {
      this.type = 'compressed';
    } else if (fs.isImageExtension(ext)) {
      this.type = 'image';
    } else if (fs.isPdfExtension(ext)) {
      this.type = 'pdf';
    } else if (fs.isBinaryExtension(ext)) {
      this.type = 'binary';
    } else {
      this.type = 'text';
    }
  }

  open() {
    const client = this.root.client;
    remote = this.remote;
    socketIO = atom.project.rcRemoteftp.socketIO;

    client.download(remote, false, (err) => {
      if (err) {
        atom.notifications.addError(`Remote FTP: ${err}`, { dismissable: false });
        return;
      }

      atom.workspace.open(this.local).then((textEditor) => {
        buffer = textEditor.getBuffer();

        textEditor.onDidDestroy((disposable) => socketIO.socket.emit("closedFile", { file: remote }));


        isFileActive = function(file) {
          fileNamesList = Object.values(socketIO.activeFiles)
          for(j = 0; j< fileNamesList.length; j++){
              for(i = 0; i< fileNamesList[j].length; i++) {
                if(file == fileNamesList[j][i])
                  return true;
            }
          }
          return false;
        }

        if(!isFileActive(remote)){
          socketIO.socket.emit('activeFile', { file: remote })
        }

        buffer.save = function(options) {
            if(isFileActive(remote)) {
              users = Object.keys(socketIO.activeFiles);
              for(j = 0; j < users.length; j++) {
                user = users[j]
                if(socketIO.activeFiles[user].indexOf(remote) >= 0 && user != socketIO.config.username) {
                  unableToSaveFile(remote, user);
                  return;
                }
              }

            }

            buffer.saveAs(buffer.getPath(), options)
        }
      });
    });
  }

  destroy() {
    this.emitter.dispose();
  }

  onChangeSelect(callback) {
    return this.emitter.on('did-change-select', callback);
  }

  get local() {
    if (this.parent) {
      let p = path.normalize(path.join(this.parent.local, this.name));

      if (path.sep !== '/') p = p.replace(/\\/g, '/');

      return p;
    }

    throw new Error('File needs to be in a Directory');
  }

  get remote() {
    if (this.parent) {
      let p = path.normalize(path.join(this.parent.remote, this.name));

      if (path.sep !== '/') p = p.replace(/\\/g, '/');

      return p;
    }

    throw new Error('File needs to be in a Directory');
  }

  get root() {
    if (this.parent) {
      return this.parent.root;
    }

    return this;
  }

  set setIsSelected(value) {
    this.isSelected = value;
    this.emitter.emit('did-change-select', value);
  }
}

export default File;
