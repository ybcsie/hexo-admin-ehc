// 2018/02/04
var React = require('react/addons');
var Dropzone = require('./Dropzone')


var PopGallery = React.createClass({

  getInitialState: function() {
    return {
      files: []
    }
  },

  onDrop: function (files) {
    // console.log('Received files: ', files);
    this.setState({files: files});
  },

  render: function () {
    return (
      <div className="gallery">
        <div className="arrow-up"></div>
        <div className="header">图片选择器</div>
        <div className="grid">
          <Dropzone onDrop={this.onDrop}>
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          {this.state.files.length > 0 ? <div>
          <h2>Uploading {this.state.files.length} files...</h2>
          <div>{this.state.files.map((file) => <img src={file.preview} className="img-cell"/> )}</div>
          </div> : null}
        </div>
        <div className="footer">
          <div className="btn-ctnr">
            <button className="upload_image">上传图片</button>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = PopGallery
