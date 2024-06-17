interface MenuHeaderProps {
  isSoldOut: boolean;
  imageUrl: string;
  name: string;
  description: string;
}

function MenuHeader(props: MenuHeaderProps) {
  return <div className="menu-header">
    <div
      className={`menu-img ${props.isSoldOut ? 'sold-out' : ''}`}
      style={{backgroundImage: `url(${props.imageUrl})`,}}
    />
    <div className="menu-info">
      <div className="menu-name" dangerouslySetInnerHTML={{__html: props.name}} />
      <div className="menu-description" dangerouslySetInnerHTML={{__html: props.description}} />
    </div>
  </div>;
}

export default MenuHeader;