import React from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { withFirebase } from '../Firebase';


class Charts extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      root: false,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0 , jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      janTotal: 0, febTotal: 0, marTotal: 0, aprTotal: 0, mayTotal: 0, junTotal: 0 , julTotal: 0,
      augTotal: 0, sepTotal: 0, octTotal: 0, novTotal: 0, decTotal: 0,
      janDel: 0, febDel: 0, marDel: 0, aprDel: 0, mayDel: 0, junDel: 0 , julDel: 0,
      augDel: 0, sepDel: 0, octDel: 0, novDel: 0, decDel: 0
    }
  }

  componentDidMount() {
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.hubMount(snapshot);
    })
  }

  hubMount(snapshot){
    var jan = 0; var feb = 0; var mar = 0; var apr = 0; var may = 0; var jun = 0;
    var jul = 0; var aug = 0; var sep = 0; var oct = 0; var nov = 0; var dec = 0;
    var janTotal  = 0; var febTotal  = 0; var marTotal = 0; var aprTotal = 0;
    var mayTotal = 0; var junTotal = 0; var julTotal  = 0; var augTotal  = 0;
    var sepTotal  = 0; var octTotal  = 0; var novTotal  = 0; var decTotal  = 0;
    var janDel  = 0; var febDel  = 0; var marDel = 0; var aprDel = 0;
    var mayDel = 0; var junDel = 0; var julDel  = 0; var augDel  = 0;
    var sepDel  = 0; var octDel  = 0; var novDel  = 0; var decDel  = 0;
    var parents = [];
    parents.push(snapshot.val().uid);
    if(snapshot.val().dateIn.substr(snapshot.val().dateIn.length-4, snapshot.val().dateIn.length-1) === new Date().getFullYear().toString()){
      if(snapshot.val().dateIn.substr(0,3) === 'Jan'){
        if(snapshot.val().dateOut.substr(0,3) === 'Feb'){
          febTotal--;
          janDel--;
        }
        janTotal++;
        jan++;
      } if(snapshot.val().dateIn.substr(0,3) === 'Feb'){
        if(snapshot.val().dateOut.substr(0,3) === 'Feb'){
          marTotal--;
          febDel--;
        }
        febTotal++;
        feb++;
      } if(snapshot.val().dateIn.substr(0,3) === 'Mar'){
        if(snapshot.val().dateOut.substr(0,3) === 'Mar'){
          aprTotal--;
          marDel--;
        }
        marTotal++;
        mar++;
      } if(snapshot.val().dateIn.substr(0,3) === 'Apr'){
        if(snapshot.val().dateOut.substr(0,3) === 'Apr'){
          mayTotal--;
          aprDel--;
        }
        aprTotal++;
        apr++;
      } if(snapshot.val().dateIn.substr(0,3) === 'May'){
        if(snapshot.val().dateOut.substr(0,3) === 'May'){
          junTotal--;
          mayDel--;
        }
        mayTotal++;
        may++
      } if(snapshot.val().dateIn.substr(0,3) === 'Jun'){
        if(snapshot.val().dateOut.substr(0,3) === 'Jun'){
          julTotal--;
          junDel--;
        }
        junTotal++;
        jun++
      } if(snapshot.val().dateIn.substr(0,3) === 'Jul'){
        if(snapshot.val().dateOut.substr(0,3) === 'Jul'){
          augTotal--;
          julDel--;
        }
        julTotal++;
        jul++
      } if(snapshot.val().dateIn.substr(0,3) === 'Aug'){
        if(snapshot.val().dateOut.substr(0,3) === 'Aug'){
          sepTotal--;
          augDel--;
        }
        augTotal++;
        aug++
      } if(snapshot.val().dateIn.substr(0,3) === 'Sep'){
        if(snapshot.val().dateOut.substr(0,3) === 'Sep'){
          octTotal--;
          sepDel--;
        }
        sepTotal++;
        sep++
      } if(snapshot.val().dateIn.substr(0,3) === 'Oct'){
        if(snapshot.val().dateOut.substr(0,3) === 'Oct'){
          novTotal--;
          octDel--;
        }
        octTotal++;
        oct++
      } if(snapshot.val().dateIn.substr(0,3) === 'Nov'){
        if(snapshot.val().dateOut.substr(0,3) === 'Nov'){
          decTotal--;
          novDel--
        }
        novTotal++;
        nov++
      } if(snapshot.val().dateIn.substr(0,3) === 'Dec'){
        decTotal++;
        dec++;
        decDel--
      }
    }
    this.props.firebase.nodes().on("value", fullNodes => {
      for(var i = 0; i<parents.length; i++){
        Object.values(fullNodes.val()).map(node => {
          if(node.parents !== "") {
            Object.values(node.parents).map(parent => {
              if (parent.uid === parents[i]) {
                parents.push(node.uid);
                if(node.dateIn.substr(node.dateIn.length-4, node.dateIn.length-1) === new Date().getFullYear().toString()){
                  if(node.dateIn.substr(0,3) === 'Jan'){
                    if(node.dateOut.substr(0,3) === 'Feb'){
                      febTotal--;
                      janDel--;
                    }
                    janTotal++;
                    jan++;
                  } if(node.dateIn.substr(0,3) === 'Feb'){
                    if(node.dateOut.substr(0,3) === 'Feb'){
                      marTotal--;
                      febDel--;
                    }
                    febTotal++;
                    feb++;
                  } if(node.dateIn.substr(0,3) === 'Mar'){
                    if(node.dateOut.substr(0,3) === 'Mar'){
                      aprTotal--;
                      marDel--;
                    }
                    marTotal++;
                    mar++;
                  } if(node.dateIn.substr(0,3) === 'Apr'){
                    if(node.dateOut.substr(0,3) === 'Apr'){
                      mayTotal--;
                      aprDel--;
                    }
                    aprTotal++;
                    apr++;
                  } if(node.dateIn.substr(0,3) === 'May'){
                    if(node.dateOut.substr(0,3) === 'May'){
                      junTotal--;
                      mayDel--;
                    }
                    mayTotal++;
                    may++
                  } if(node.dateIn.substr(0,3) === 'Jun'){
                    if(node.dateOut.substr(0,3) === 'Jun'){
                      julTotal--;
                      junDel--;
                    }
                    junTotal++;
                    jun++
                  } if(node.dateIn.substr(0,3) === 'Jul'){
                    if(node.dateOut.substr(0,3) === 'Jul'){
                      augTotal--;
                      julDel--;
                    }
                    julTotal++;
                    jul++
                  } if(node.dateIn.substr(0,3) === 'Aug'){
                    if(node.dateOut.substr(0,3) === 'Aug'){
                      sepTotal--;
                      augDel--;
                    }
                    augTotal++;
                    aug++
                  } if(node.dateIn.substr(0,3) === 'Sep'){
                    if(node.dateOut.substr(0,3) === 'Sep'){
                      octTotal--;
                      sepDel--;
                    }
                    sepTotal++;
                    sep++
                  } if(node.dateIn.substr(0,3) === 'Oct'){
                    if(node.dateOut.substr(0,3) === 'Oct'){
                      novTotal--;
                      octDel--;
                    }
                    octTotal++;
                    oct++
                  } if(node.dateIn.substr(0,3) === 'Nov'){
                    if(node.dateOut.substr(0,3) === 'Nov'){
                      decTotal--;
                      novDel--
                    }
                    novTotal++;
                    nov++
                  } if(node.dateIn.substr(0,3) === 'Dec'){
                    decTotal++;
                    dec++;
                    decDel--
                  }
                }
              }
            })
          }
        });
      }
      this.setState({jan: jan, feb: feb, mar: mar, apr: apr, may: may, jun: jun,
        jul: jul, aug: aug, sep: sep, oct: oct, nov: nov, dec: dec, janTotal: janTotal, febTotal: febTotal,
        marTotal: marTotal, aprTotal: aprTotal, mayTotal: mayTotal, junTotal: junTotal,
        julTotal: julTotal, augTotal: augTotal, sepTotal: sepTotal, octTotal: octTotal,
        novTotal: novTotal, decTotal: decTotal, janDel: janDel, febDel: febDel,
        marDel: marDel, aprDel: aprDel, mayDel: mayDel, junDel: junDel,
        julDel: julDel, augDel: augDel, sepDel: sepDel, octDel: octDel,
        novDel: novDel, decDel: decDel})
    });
  }

  render() {
    const { jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec, janTotal, febTotal,
      marTotal, aprTotal, mayTotal, junTotal, julTotal, augTotal, sepTotal, octTotal, novTotal, decTotal,
      janDel, febDel, marDel, aprDel, mayDel, junDel, julDel, augDel, sepDel, octDel, novDel, decDel} = this.state;
    return (
      <div className="container" style={{margin: 'auto', marginTop: '1%'}}>
        <div className="row">
            <BarChart
            options={{
              colors: ['rgb(33, 150, 243)'],
              legend: { position: 'none' }
            }}
            title={"Entities"}
            data={[
              ["Month", "New Entities", "Entities with no projects"],
              ["January", jan, janDel],
              ["February", feb, febDel],
              ["March", mar, marDel],
              ["April", apr, aprDel],
              ["May", may, mayDel],
              ["June", jun, junDel],
              ["July", jul, julDel],
              ["August", aug, augDel],
              ["September", sep, sepDel],
              ["October", oct, octDel],
              ["November", nov, novDel],
              ["December", dec, decDel]
            ]}
            />
            <BarChart
              options={{
                colors: ['rgb(33, 150, 243)'],
                legend: { position: 'none' }
              }}
              title={"Entities prevision"}
              data={[
                ["Month", "Entities"],
                ["January", janTotal],
                ["February", febTotal + janTotal],
                ["March", marTotal + febTotal + janTotal],
                ["April", aprTotal + marTotal + febTotal + janTotal],
                ["May", mayTotal + aprTotal + marTotal + febTotal + janTotal],
                ["June", junTotal + mayTotal + aprTotal + marTotal + febTotal + janTotal],
                ["July", julTotal + junTotal + mayTotal + aprTotal + marTotal + febTotal + janTotal],
                ["August", augTotal + julTotal + junTotal + mayTotal + aprTotal + marTotal + febTotal + janTotal],
                ["September", sepTotal + augTotal + julTotal + junTotal + mayTotal + aprTotal + marTotal + febTotal + janTotal],
                ["October", octTotal + sepTotal + augTotal + julTotal + junTotal + mayTotal + aprTotal + marTotal + febTotal + janTotal],
                ["November", novTotal + octTotal + sepTotal + augTotal + julTotal + junTotal + mayTotal + aprTotal + marTotal + febTotal + janTotal],
                ["December", decTotal + novTotal + octTotal + sepTotal + augTotal + julTotal + junTotal + mayTotal + aprTotal + marTotal + febTotal + janTotal]
              ]}
            />
          <PieChart/>
        </div>
      </div>
    );
  }
}

const condition = authUser => !!authUser ;

export default compose(
  withAuthorization(condition),
  withFirebase
)(Charts);