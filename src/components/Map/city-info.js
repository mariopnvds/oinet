import React, {PureComponent} from 'react';

export default class CityInfo extends PureComponent {

  render() {
    const {info} = this.props;
    return (
      <div>
        {console.log(info)}
        <div style={{width: '400px'}}>
          <p><b>Entity:</b> {info.firm}</p>
          <hr/>
          <p><b>City:</b> {info.city}</p>
          <p><b>Country:</b> {info.country}</p>
          <hr/>
          <p><b>Category:</b> {info.category}</p>
          <hr/>
          <p><b>Number of activities:</b> {info.projects}</p>
          <hr/>
          <p><b>Description:</b> {info.description}</p>
        </div>
          {/*<img alt="img" width={240} src={info.image} />*/}
      </div>
    );
  }
}