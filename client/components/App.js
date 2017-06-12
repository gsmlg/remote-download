import React from 'react';

import FileList from './file_list';

class AppComponent extends React.Component {

  render() {
    return (
      <div className="file-app">
        <div className="fileList">
          <FileList />
        </div>
      </div>
    );
  }
}

export default AppComponent;
