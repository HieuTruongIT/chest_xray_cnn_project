import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import MainLayout from '../layouts/MainLayout';

export default function AppRoutes() {
  return (
    <Router>
      <MainLayout>
        <Switch>
          <Route exact path="/" component={Home} />
          {/* Add more routes here as needed */}
        </Switch>
      </MainLayout>
    </Router>
  );
}

