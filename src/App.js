import { useState, useEffect } from 'react'

import Login from './screens/Login';
import MapScreen from './screens/MapScreen';
import ShareMapScreen from './screens/ShareMapScreen';

function App() {

  const [currentRoute, setCurrentRoute] = useState(false);
  useEffect(() => {
    const pathName = window.location.pathname;
    const queryString = new window.URLSearchParams(window.location.search)
    
    const mapName = queryString.get('name')
    if(pathName.includes('share/map') && mapName){
      setCurrentRoute("share/map")
    }
    else{
      setCurrentRoute("login")
    }
  }, []);

  useEffect(() => {
    if(currentRoute){
      if(currentRoute === 'share/map'){
        // window.history.pushState({}, '', '/share/map')
      }
      else if(currentRoute === 'map'){
        window.history.pushState({}, '', '/map')

      }
      else if(currentRoute === 'login'){
        window.history.pushState({}, '', '/login')

      }
      else {
        window.history.pushState({}, '', '/')

      }
    } 
  }, [currentRoute]);

  return (
    <div>
      {currentRoute === 'login' ? <Login setCurrentRoute={setCurrentRoute} /> : false}
      {currentRoute === 'map' ? <MapScreen /> : false}
      {currentRoute === 'share/map' ? <ShareMapScreen /> : false}
    </div>
  );
}

export default App;
