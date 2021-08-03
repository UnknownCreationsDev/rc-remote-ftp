'use babel';

const notify = atom.notifications;

export const isEEXIST = (path, forceBtn, cancelBtn, dismissable = true) => {
  notify.addWarning('Remote FTP: Already exists file in localhost', {
    detail: `Delete or rename file before downloading folder ${path}`,
    dismissable,
    buttons: [
      {
        text: 'Delete file',
        className: 'btn btn-error',
        onDidClick() { forceBtn(this); },
      },
      {
        text: 'Cancel',
        className: 'btn btn-float-right',
        onDidClick() {
          if (typeof cancelBtn === 'function') cancelBtn(this);
          else this.removeNotification();
        },
      },
    ],
  });
};

export const isEISDIR = (path, forceBtn, cancelBtn, dismissable = true) => {
  notify.addWarning('Remote FTP: Already exists folder in localhost', {
    detail: `Delete or rename folder before downloading file ${path}`,
    dismissable,
    buttons: [
      {
        text: 'Delete folder',
        className: 'btn btn-error',
        onDidClick() { forceBtn(this); },
      },
      {
        text: 'Cancel',
        className: 'btn btn-float-right',
        onDidClick() {
          if (typeof cancelBtn === 'function') cancelBtn(this);
          else this.removeNotification();
        },
      },
    ],
  });
};

//Rc custom notifications start

export const unableToConnectFtp = (dismissable = false, reason = '') => {
  notify.addError('Unable to connect to remote ftp server!', { detail: reason });
}

export const userDisconnected = (user = '') => {
  notify.addError('RoleCatcher', {
    detail: user + ' has disconnected',
    icon: 'log-out'
  });
}

export const userConnected = (user = '') => {
  notify.addSuccess('RoleCatcher', {
    detail: user + ' has connected',
    icon: 'log-in'
  });
}

export const successfullyConnectedToRc = () => {
  notify.addSuccess('Role Catcher', { detail: 'Successfully connected to the server' });
}

export const invalidPassword = () => {
  notify.addError('RoleCatcher', {
    detail: 'Invalid password used to connect the server'
  });
}

export const unknownUser = (user = '') => {
  notify.addError('RoleCatcher', {
    detail: 'Unknown username: ' + user
  });
}

export const unableToSaveFile = (file = '', user = '') => {
  notify.addError('RoleCatcher | Unable to save file', {
    detail: `${user} is currently editing this file!`
  });
}


export const restartedApache = () => {
  notify.addSuccess('RoleCatcher | Apache Restarted', {});
}
//Rc custom notifications end

export const isAlreadyExits = (path, type = 'folder', dismissable = false) => {
  notify.addWarning(`Remote FTP: The ${type} already exists.`, {
    detail: `${path} has already on the server!`,
    dismissable,
  });
};

export const isPermissionDenied = (path, dismissable = false) => {
  notify.addWarning('Remote FTP: Permission denied', {
    detail: `${path} : Permission denied`,
    dismissable,
  });
};

export const isNoChangeGroup = (response, dismissable = false) => {
  notify.addWarning('Remote FTP: Group privileges was not changed.', {
    detail: response.message,
    dismissable,
  });
};

export const isNoChangeOwner = (response, dismissable = false) => {
  notify.addWarning('Remote FTP: Owner privileges was not changed.', {
    detail: response.message,
    dismissable,
  });
};

export const isNoChangeOwnerAndGroup = (response, dismissable = false) => {
  notify.addWarning('Remote FTP: Owner and Group privileges was not changed.', {
    detail: response.message,
    dismissable,
  });
};

export const isNotImplemented = (detail, dismissable = false) => {
  notify.addInfo('Remote FTP: Not implemented.', {
    detail,
    dismissable,
  });
};

export const isGenericUploadError = (detail, dismissable = false) => {
  notify.addError('Remote FTP: Upload Error.', {
    detail,
    dismissable,
  });
};
