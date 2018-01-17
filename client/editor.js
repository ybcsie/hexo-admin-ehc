
var path = require('path')
var React = require('react/addons')
var cx = React.addons.classSet
var Promise = require('es6-promise').Promise
var PT = React.PropTypes
var CodeMirror = require('./code-mirror')
var SinceWhen = require('./since-when')
var Rendered = require('./rendered')
var CheckGrammar = require('./check-grammar')
var ConfigDropper = require('./config-dropper')
var RenameFile = require('./rename-file')

var Editor = React.createClass({

  // cmRef: null,

  propTypes: {
    post: PT.object,
    raw: PT.string,
    updatedRaw: PT.string,
    onChangeTitle: PT.func,
    title: PT.string,
    updated: PT.object,
    isDraft: PT.bool,
    onPublish: PT.func.isRequired,
    onUnpublish: PT.func.isRequired,
    tagsCategoriesAndMetadata: PT.object,
    adminSettings: PT.object,

  },

  getInitialState: function() {
    //FIXME, use href is right!
    var url = window.location.href.split('/')
    var rootPath = url.slice(0, url.indexOf('admin')).join('/');
    var completeURL = rootPath+'/'+this.props.post.path;
    return {
      postPath: this.props.post.path,
      previewLink: completeURL,
      checkingGrammar: false,
    }
  },
  // TODO, ...juest for test
  componentDidMount: function() {

  },

  // recreate previewLink
  handlePreviewLink: function(postNewPath) {
    var url = window.location.href.split('/')
    var rootPath = url.slice(0, url.indexOf('admin')).join('/');
    var completeURL = rootPath+'/'+postNewPath;
    this.setState({
      postPath: postNewPath,
      previewLink: completeURL
    })
  },

  handleChangeTitle: function (e) {
    return this.props.onChangeTitle(e.target.value)
  },

  handleScroll: function (percent) {
    if (!this.state.checkingGrammar) {
      var node = this.refs.rendered.getDOMNode()
      var height = node.getBoundingClientRect().height
      node.scrollTop = (node.scrollHeight - height) * percent
    }
  },

  onCheckGrammar: function () {
    this.setState({
      checkingGrammar: !this.state.checkingGrammar
    });
  },

  // TODO, ...add real image address...
  onAddImage: function () {
    // console.log('add image...');
    this.setState({
      mdImg: '![image]()'
    });
  },

  render: function () {
    return <div className={cx({
      "editor": true,
      "editor--draft": this.props.isDraft
    })}>
      <div className="editor_top">
        <input
          className='editor_title'
          value={this.props.title}
          onChange={this.handleChangeTitle}/>

        {!this.props.isPage && <ConfigDropper
          post={this.props.post}
          tagsCategoriesAndMetadata={this.props.tagsCategoriesAndMetadata}
          onChange={this.props.onChange}/>}

        {!this.props.isPage && (this.props.isDraft ?
          /* this is a comment for publish button */
          <button className="editor_publish" onClick={this.props.onPublish}>
            Publish
          </button> :
          <button className="editor_unpublish" onClick={this.props.onUnpublish}>
            Unpublish
          </button>)}

          {!this.props.isPage && (this.props.isDraft ?
          <button className="editor_remove" title="Remove"
                  onClick={this.props.onRemove}>
            <i className="fa fa-trash-o" aria-hidden="true"/>
          </button> :
          <button className="editor_remove" title="Can't Remove Published Post"
                  onClick={this.props.onRemove} disabled>
            <i className="fa fa-trash-o" aria-hidden="true"/>
          </button>)}

          {!this.props.isPage &&
          <button className="editor_checkGrammar" title="Check for Writing Improvements"
                  onClick={this.onCheckGrammar}>
            <i className="fa fa-check-circle-o"/>
          </button>}
          {/* add image button */}
          {!this.props.isPage &&
            <button className="editor_addImage" title="Add Image to Post"
                    onClick={this.onAddImage}>
              <i className="fa fa-picture-o"/>
            </button>
          }

      </div>

      <div className="editor_main">
        <div className="editor_edit">
          <div className="editor_md-header">
            {this.props.updated &&
                <SinceWhen className="editor_updated"
                prefix="saved "
                time={this.props.updated}/>}
            <span>Markdown&nbsp;&nbsp;
              <RenameFile post={this.props.post}
                handlePreviewLink={this.handlePreviewLink} /></span>
          </div>
          {/* comment like this */}
          <CodeMirror
            mdImg={this.state.mdImg}
            forceLineNumbers={this.state.checkingGrammar}
            onScroll={this.handleScroll}
            initialValue={this.props.raw}
            onChange={this.props.onChangeContent}
            adminSettings={this.props.adminSettings} />
        </div>
        <div className="editor_display">
          <div className="editor_display-header">
            <span className="editor_word-count">
              {this.props.wordCount} words
            </span>
            Preview
            {' '}<a className="editor_perma-link" href={this.state.previewLink} target="_blank">
              <i className="fa fa-link"/> {this.state.postPath}
            </a>
          </div>
          {!this.state.checkingGrammar && <Rendered
            ref="rendered"
            className="editor_rendered"
            text={this.props.rendered}/>}
          {this.state.checkingGrammar && <CheckGrammar
            toggleGrammar={this.onCheckGrammar}
            raw={this.props.updatedRaw} />}
        </div>
      </div>
    </div>;
  }
})

module.exports = Editor
