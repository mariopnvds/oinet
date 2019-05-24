import React from 'react';
import Floater from 'react-floater';
import { withFirebase } from '../Firebase';
import ReactModal from 'react-modal';
import PDFViewer from 'mgr-pdf-viewer-react';


class OwnProjs extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      uploadValue: 0,
      error: '',
      project: '',
      showModal: false
    }
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
  }

  componentWillUnmount() {
    this.props.firebase.findProject().off();
    this.props.firebase.nodes().off()
  }

  handleOpenModal (project) {
    this.setState({ showModal: true, project: project});
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  handleUpload(event, project){
    console.log(project.title)
    console.log(project.partner2, project.partner1);
    const file = event.target.files[0];
    console.log(file.name)
    const storageRef = this.props.firebase.storage(project.partner1, project.partner2, project.title, file.name);
    const task = storageRef.put(file);
    task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({
          uploadValue: percentage,
        })
      }, error => {
        this.setState({error: error});
        console.log(error.message)
      }, () => {
        this.setState({uploadValue: 0})
        task.snapshot.ref.getDownloadURL().then((url) => {
          this.props.firebase.nodes().once("value", snapshot => {
            Object.values(snapshot.val()).map(node => {
              if(node.username === project.partner1){
                console.log(project.partner1)
                Object.keys(node.projects).map(key => {
                  if(node.projects[key].title === project.title && node.projects[key].partner1 === project.partner1 && node.projects[key].partner2 === project.partner2){
                    this.props.firebase.findProject(node.uid, key).update({
                      url: url
                    });
                  }
                })
              }
            });
            Object.values(snapshot.val()).map(node => {
              if(node.username === project.partner2){
                console.log(project.partner2)
                Object.keys(node.projects).map(key => {
                  if(node.projects[key].title === project.title && node.projects[key].partner1 === project.partner1 && node.projects[key].partner2 === project.partner2){
                    this.props.firebase.findProject(node.uid, key).update({
                      url: url
                    });
                    this.setState({project: {
                      url: url
                      }
                    })
                  }
                })
              }
            });
          });
        })
      }
    );
  }

  onDelete(title, p1, p2){
    this.props.firebase.nodes().on("value", snapshot => {
      Object.values(snapshot.val()).map(node => {
        if(node.username === p1){
          if(node.projects.length === undefined){
            this.props.firebase.node(node.uid).update({projects: ""})
          }
          Object.keys(node.projects).map(key => {
            if(node.projects[key].title === title && node.projects[key].partner1 === p1 && node.projects[key].partner2 === p2){
              this.props.firebase.findProject(node.uid, key).remove()
            }
          })
        }
        if(node.username === p2){
          if(node.projects.length === undefined){
            this.props.firebase.node(node.uid).update({projects: ""})
          }
          Object.keys(node.projects).map(key => {
            if(node.projects[key].title === title && node.projects[key].partner1 === p1 && node.projects[key].partner2 === p2){
              this.props.firebase.findProject(node.uid, key).remove()
            }
          })
        }
      })
    })
  }

  onActivate(title, p1, p2){
    this.props.firebase.nodes().once("value", snapshot => {
      Object.values(snapshot.val()).map(node => {
        if(node.username === p1){
          Object.keys(node.projects).map(key => {
            if(node.projects[key].title === title && (node.projects[key].partner1 === p1 || node.projects[key].partner2 === p2) && (node.projects[key].partner2 === p2 || node.projects[key].partner1 === p1)){
              this.props.firebase.findProject(node.uid, key).update({
                status: "active"
              })
            }
          })
        }
        if(node.username === p2){
          Object.keys(node.projects).map(key => {
            if(node.projects[key].title === title && (node.projects[key].partner1 === p1 || node.projects[key].partner2 === p2) && (node.projects[key].partner2 === p2 || node.projects[key].partner1 === p1)){
              this.props.firebase.findProject(node.uid, key).update({
                status: "active"
              })
            }
          })
        }
      })
    })
  }

  onFinish(title, p1, p2){
    this.props.firebase.nodes().once("value", snapshot => {
      Object.values(snapshot.val()).map(node => {
        if(node.username === p1){
          Object.keys(node.projects).map(key => {
            if(node.projects[key].title === title && (node.projects[key].partner1 === p1 || node.projects[key].partner2 === p2) && (node.projects[key].partner2 === p2 || node.projects[key].partner1 === p1)){
              this.props.firebase.findProject(node.uid, key).update({
                status: "finished"
              })
            }
          })
        }
      })
      Object.values(snapshot.val()).map(node => {
        if(node.username === p2){
          Object.keys(node.projects).map(key => {
            if(node.projects[key].title === title && (node.projects[key].partner1 === p1 || node.projects[key].partner2 === p2) && (node.projects[key].partner2 === p2 || node.projects[key].partner1 === p1)){
              this.props.firebase.findProject(node.uid, key).update({
                status: "finished"
              })
            }
          })
        }
      })
    })
  }

  render() {
    return (
        <div className="card card-1" style={{margin: 'auto', width: this.props.width, marginTop: '1%', borderRadius: '10px'}}>
            <div className="card-body">
              <div className="container">
                <a style={{display:'inline-block', margin: '4px 0px 0px 0px'}}><b>{this.props.project.project.title} </b></a>
                <p style={{margin: '4px 0', color: '#8294aa'}}>{this.props.project.project.partner1} - {this.props.project.project.partner2} </p>
                <p style={{margin: '4px 0'}}>{this.props.project.project.description}</p>
                {this.props.project.project.status === 'active' ?
                  <p style={{margin: '4px 0'}}>Status: <b style={{color: '#28a745'}}>{this.props.project.project.status}</b></p> :
                  (this.props.project.project.status === 'finished' ?
                    <p style={{margin: '4px 0'}}>Status: <b style={{color: '#dc3545'}}>{this.props.project.project.status}</b></p> :
                    null)}
                <a>Budget: <b>{this.props.project.project.budget} $</b></a>
                <div className="" align="center">
                  {this.props.project.project.status === 'active' ?
                    <Floater
                      styles={{
                        tooltip: {
                          filter: "none"
                        }, container: {
                          backgroundColor: "#000", borderRadius: 5, color: "#fff", filter: "none",
                          minHeight: "none", maxWidth: 100, padding: 10, textAlign: "right"
                        }, arrow: {
                          color: "#000", length: 8, spread: 10
                        }
                      }}
                      content={
                        <div align="center">
                          Finish Project
                        </div>
                      } event="hover" placement="bottom"
                    >
                      <button type="button" onClick={() => this.onFinish(this.props.project.project.title, this.props.project.project.partner1, this.props.project.project.partner2)}
                              className="butt2" style={{color: '#dc3545'}}>
                        <i className="fas fa-check"> </i>
                      </button>
                    </Floater>
                    :
                    (this.props.project.project.status === 'finished' ?
                      <Floater styles={{
                          tooltip: {
                            filter: "none"
                          }, container: {
                            backgroundColor: "#000", borderRadius: 5, color: "#fff",
                            filter: "none", minHeight: "none", maxWidth: 100, padding: 10, textAlign: "right"
                          }, arrow: {
                            color: "#000", length: 8, spread: 10
                          }
                        }}
                        content={
                          <div align="center">
                            Activate Project
                          </div>
                        } event="hover" placement="bottom"
                      >
                        <button type="button" onClick={() => {this.onActivate(this.props.project.project.title, this.props.project.project.partner1, this.props.project.project.partner2)}}
                                className="butt2" style={{color: '#28a745'}}>
                          <i className="fas fa-redo-alt">  </i>
                        </button>
                      </Floater>
                      :
                    null)}
                  <Floater
                    styles={{
                      tooltip: {
                        filter: "none"
                      }, container: {
                        backgroundColor: "#000", borderRadius: 5, color: "#fff", filter: "none",
                        minHeight: "none", maxWidth: 100, padding: 10, textAlign: "right"
                      }, arrow: {
                        color: "#000", length: 8, spread: 10
                      }
                    }} content={
                      <div align="center">
                        Delete Project
                      </div>
                    } event="hover" placement="top"
                  >
                    <button onClick={() => this.onDelete(this.props.project.project.title, this.props.project.project.partner1, this.props.project.project.partner2)}
                            type="button" className="butt2" style={{color: 'red'}} >
                      <i className="far fa-trash-alt"> </i>
                    </button>
                  </Floater>
                  <button className="butt2" onClick={() => this.handleOpenModal(this.props.project.project)}>
                    <i className="far fa-file"> </i>
                  </button>
                  <ReactModal
                    style={{
                      overlay:{
                        backgroundColor: 'rgba(52, 52, 52, 0.6)',
                      },
                      content: {
                        zIndex: 1050, margin: 'auto', width: '700px'
                      }
                    }}
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                  >
                    <div align="right">
                      <button className="butt2" onClick={this.handleCloseModal}><i className="fas fa-times"> </i></button>
                    </div>
                    {(this.state.uploadValue === 0 || this.state.uploadValue === 100) ? null
                      :
                      <div align="center">
                        <div align="center">
                          {parseInt(this.state.uploadValue)}%
                        </div>
                        <progress value={this.state.uploadValue} max="100"> </progress>
                      </div>
                    }

                    <div align="center">
                      <div className="choose_file mr-4">
                        <button type="button" className="butt2" onClick={() => {document.getElementById('upload').click()}}>
                          <i className="fas fa-upload"> Upload Report</i>
                        </button>
                        <input id="upload" name="img" type="file" accept="application/pdf" onChange={(event) => {this.handleUpload(event, this.state.project)}}/>
                      </div>
                      {this.state.project.url !== '' ?
                        <a className="butt2 ml-4" href={this.state.project.url} target="_blank">
                          <i className="far fa-download"> Download Report</i>
                        </a> : null}
                    </div>
                    {this.state.project.url !== '' ?
                      <PDFViewer document={{ url: this.state.project.url }}
                       scale={0.8}/> : null}
                  </ReactModal>
                </div>
              </div>
            </div>
        </div>
    )
  }
}

ReactModal.setAppElement('#root')

export default  withFirebase(OwnProjs);