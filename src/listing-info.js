import React, {PureComponent} from 'react';

export default class ListingInfo extends PureComponent {
  render() {
    const {info} = this.props;
    const displayName = `${info.Position}, ${info.Categories}`;

    return (
      <div>
        <div>
          {displayName} |{' '}
          <a
            target="_new"
            href={`https://modernaddis.com`}
          >
            Link
          </a>
        </div>
        <img width={240} src={info.Image} />
      </div>
    );
  }
}