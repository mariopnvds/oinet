import React, {PureComponent} from 'react';

const ICON2 = `M1,11a10,10 0 1,0 20,0a10,10 0 1,0 -20,0`;

export default class CityPin extends PureComponent {

  render() {
    const {size = 20, onClick, info} = this.props;

    return (
      <div>
        <svg
          height={size}
          viewBox="0 0 24 24"
          style={{cursor: 'pointer', fill: info.color, stroke: '#000', transform: `translate(${-size / 2}px,${-size/2}px)`}}
          onClick={onClick}
        >
          <path d={ICON2}/>
        </svg>
        <a style = {{ padding: '2px', color: 'rgba(255, 255, 255, 1)', cursor: 'pointer',
          background: 'rgba(128, 128, 128, .7)', borderRadius: '6px', border: '1px solid black' }}>{info.firm}</a>
      </div>
    );
  }
}