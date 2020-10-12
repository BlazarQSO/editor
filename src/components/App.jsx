import React from 'react';
import './App.scss';
import Header from './Header/Header'
import Aside from './Aside/Aside'
import Main from './Main/Main'
import Footer from './Footer/Footer'

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Header />
                <Aside />
                <Main />
                <Footer />
            </React.Fragment>
        )
    }
}

export default App;
