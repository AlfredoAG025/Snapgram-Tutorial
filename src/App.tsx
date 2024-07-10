import './globals.css';

import { Redirect, Route, Switch } from 'wouter';
import { Home } from './_root/pages';
import Login from './_auth/pages/Login';
import Register from './_auth/pages/Register';



const App = () => {
    return (
        <main className="flex h-screen">
            {/* public routes */}
            <Switch>
                <Route path="/sign-in" component={Login} />
                <Route path="/sign-up" component={Register} />
            </Switch>

            {/* private routes */}
            <Route path="/" component={Home} />
        </main>

    );
}

export default App;