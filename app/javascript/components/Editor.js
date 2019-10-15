import React from 'react';
import { Switch } from 'react-router-dom';
import EventForm from './EventForm';
import axios from 'axios';
import PropTypes from 'prop-types';
import PropsRoute from './PropsRoute';
import Header from './Header';
import EventList from './EventList';
import Event from './Event';

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: null,
    };
    this.addEvent = this.addEvent.bind(this);
  }

  componentDidMount() {
    axios
      .get('/api/events.json')
      .then(response => this.setState({ events: response.data }))
      .catch((error) => {
        console.log(error);
      });
  }

  addEvent(newEvent) {
    axios
      .post('/api/events.json', newEvent)
      .then((response) => {
        alert('Event Added!');
        const savedEvent = response.data;
        this.setState(prevState => ({
          events: [...prevState.events, savedEvent],
        }));
        const { history } = this.props;
        history.push(`/events/${savedEvent.id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { events } = this.state;
    if (events === null) return null;

    const { match } = this.props;
    const eventId = match.params.id;
    const event = events.find(e => e.id === Number(eventId));

    return (
      <div>
        <Header />
        <div className="grid">
          <EventList events={events} activeId={Number(eventId)} />
          <Switch>
            <PropsRoute path="/events/new" component={EventForm} onSubmit={this.addEvent} />
            <PropsRoute path="/events/:id" component={Event} event={event} />
          </Switch>
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  match: PropTypes.shape(),
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

Editor.defaultProps = {
  match: undefined,
};

export default Editor;
