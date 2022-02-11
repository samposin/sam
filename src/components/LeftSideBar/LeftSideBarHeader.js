import { Dropdown, Image, Menu, Icon } from "semantic-ui-react";

export default function LeftSideBarHeader({image}){
    return(
        <Menu.Item>
            <Menu.Header>
            <Image size='small' src='./img/logo-peregrine-black.png' />
                {/* <Image src='/images/wireframe/square-image.png' size='medium' circular /> */}
                {/* <div className="circle-initials">LT</div> */}
                {/* <img className="circle-initials" size='small' src={image?image:''}/> */}

                <Dropdown
                    floating
                    trigger={<><Image className="circle-initials" size='small' src={image} /><Icon name="chevron down" /></>}
                    inline
                    options={[{key: 'logout', text: 'logout',value: 'logout', content: 'Logout', onClick:()=>{
                        //clear all local storage and session storage and go to login
                        sessionStorage.clear()
                        localStorage.clear()
                        document.cookie = ''
                        window.location.reload()
                    }}]}
                // defaultValue={options[0].value}
                />

            </Menu.Header>
        </Menu.Item>
    )
}
