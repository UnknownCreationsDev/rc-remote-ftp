'use babel';

import { io } from "socket.io-client";
import fs from 'fs'
import {
    userDisconnected, userConnected,
    successfullyConnectedToRc, invalidPassword,
    unknownUser
  } from './notifications.js'

export default class socketIO {

  constructor(client) {

    this.connected = false;
    this.config = {}
    this.activeFiles = {  }

    try {
      const data = fs.readFileSync(client.getRcConfigPath(), 'utf8')
      this.config = JSON.parse(data);
      io.config = this.config;
    } catch (err) { console.error(err) }

    io.makeUserHtml = function(username, activeFiles = [] ) {
      list = ``;
      if(activeFiles != []) {
        for(i in activeFiles) {
          activeFile = activeFiles[i]
          activeFile = activeFile.replace(io.config.remoteReplace, '');
          list+= `
          <li is="tree-view-file" class="file entry list-item">
            <span class="name icon icon-file-text" title="${activeFile}" data-name="${activeFile}" data-path="${activeFile}">${activeFile}</span>
          </li>`
        }
      }

      return `
      <li is="tree-view-directory" class="directory entry list-nested-item expanded" draggable="true">
        <div class="header list-item">
          <span style="font-size: 15px; font-weight: bold;" class="name icon icon-person" data-path="" data-name="${username}" title="${username}">${username}</span>
        </div>
        <ol class="entries list-tree">
          ${list}
        </ol>
      </li>`;
    }

    this.socket = io(this.config.server);

    this.socket.on("connect", () => { this.socket.emit("userAuth", { 'user': this.config.username, 'pass': this.config.password }); });

    this.socket.on("success", (msg) => { successfullyConnectedToRc(); this.connected = true; } );

    this.socket.on("disconnect", (msg) => this.connected = false);

    this.socket.on("invalidPassword", (msg) => invalidPassword());

    this.socket.on("unknownUser", (msg) => unknownUser(msg.user));

    this.socket.on("userDisconnected", (msg) => userDisconnected(msg.user));

    this.socket.on("userConnected", (msg) => userConnected(msg.user));

    //update user event
    this.socket.on("users", (msg) => {

      this.activeFiles = { }

      for(i in msg.users)
        this.activeFiles[msg.users[i].username] = msg.users[i].activeFiles

      atom.project.rcRemoteftpMain.rcView.list.children().remove();
      html = '<div class="remote-ftp-offline-inner"><center><h1>Online Users: </h1></center><ol class="tree-view-root full-menu list-tree has-collapsable-children focusable-panel">'

      for(i in msg.users)
        html += io.makeUserHtml(msg.users[i].username, msg.users[i].activeFiles)

      html += '</ol></div>'

      atom.project.rcRemoteftpMain.rcView.list.append(html);
    });

    this.socket.on("error", (error) => console.log(error));

    this.socket.connect();

  }

}
