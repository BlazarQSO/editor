import React from 'react';
import '../assets/fonts/font-faces.scss';
import './App.scss';
import Header from './Header/Header'
import Aside from './Aside/Aside'
import Main from './Main/Main'
import Footer from './Footer/Footer'
import About from './About/About'
import { Route, Switch } from 'react-router-dom'

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Header />
                <section className="root">
                    <Aside />
                    <Switch>
                        <Route path="/" exact component={Main} />
                        <Route path="/about" component={About} />
                        <Route render={() => <h1 style={{ color: 'red', textAlign: 'center' }}>404 not found</h1>} />
                    </Switch>
                </section>
                <Footer />
            </React.Fragment>
        )
    }
}

export default App;
