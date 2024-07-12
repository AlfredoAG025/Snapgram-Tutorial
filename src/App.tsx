import './globals.css';

import { Redirect, Route, Switch } from 'wouter';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import Login from './_auth/pages/Login';
import Register from './_auth/pages/Register';
import { Toaster } from "@/components/ui/toaster"


const App = () => {
    return (
        <main className="flex">
            {/* public routes */}
            <Switch>
                <Route path="/sign-in" component={Login} />
                <Route path="/sign-up" component={Register} />
            </Switch>

            {/* private routes */}
            <Switch>
                <Route path="/" component={Home} />
                <Route path="/explore" component={Explore} />
                <Route path="/saved" component={Saved} />
                <Route path="/all-users" component={AllUsers} />
                <Route path="/create-post" component={CreatePost} />
                <Route path="/update-post/:id" component={EditPost} />
                <Route path="/posts/:id" component={PostDetails} />
                <Route path="/profile/:id" component={Profile} />
                <Route path="/profile/:id/*" component={Profile} />
                <Route path="/update-profile/:id" component={UpdateProfile} />
            </Switch>
            <Toaster />
        </main>

    );
}

export default App;