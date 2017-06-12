import React, {Component} from 'react';
import cx from 'classnames';

export default class FileList extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    fetch('/files').then((resp) => {
      return resp.json();
    }).then((files) => {
      this.setState({
        loading: false,
        files: files
      });
    });
  }

  getFiles() {
    let {files} = this.state;
    let list =  files.map((file) => {
      let klass = cx('icon-file-type', file.type);
      return (
        <div key={file.ino} className="file row">
          <div className="col-3">
            <i className={klass}/>
            <span className="filename">{file.name}</span>
          </div>
          <div className="col-1">
            {file.size}
          </div>
        </div>
      );
    });
    list.unshift(
      <div key={'title'} className="file row">
        <div className="col-3">
          <span className="filename">{'Name'}</span>
        </div>
        <div className="col-1">
          {'Size'}
        </div>
      </div>
    );
    return list;
  }

  render () {
    return (
      <div className="files-wrapper container-fluid">
        {this.state.loading ? <div className="loading"><div className="loading-icon"/></div> : this.getFiles()}
      </div>
    );
  }
}
