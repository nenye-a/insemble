import React from 'react';
import { Card, CardHeader, ListGroup } from 'shards-react';
import profilePicture from '../../assets/images/profile-picture-placeholder.png';

let MENUS = [
  {
    id: 'userAccountDetails',
    text: 'Profiles',
  },
  {
    id: 'searchHistory',
    text: 'Searches',
  },
];

export default function UserDetails(props) {
  let { name, avatar, companyName, onSegmentClick, selectedSegment } = props;
  return (
    <Card small className="mb-4 py-3 px-4">
      <CardHeader>
        <div className="mb-3 d-flex justify-content-center">
          <img className="rounded-circle" src={avatar} alt={name} width="200" />
        </div>
        <h4 className="mb-0">{name}</h4>
        <span className="text-muted d-block mb-2">{companyName}</span>
      </CardHeader>
      <ListGroup flush className="mx-3">
        {MENUS.map((item) => {
          let isSelected = selectedSegment === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`touchable h5 ${!isSelected && 'text-muted'}`}
              onClick={() => onSegmentClick(item.id)}
            >
              {item.text}
            </a>
          );
        })}
      </ListGroup>
    </Card>
  );
}

UserDetails.defaultProps = {
  name: '',
  avatar: profilePicture,
  companyName: '',
};
