import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../services/api";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start_datetime: "",
    end_datetime: "",
    color: "#667eea",
  });

  // Charger les événements au montage et quand la date change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const start = moment(date).startOf("month").format("YYYY-MM-DD");
        const end = moment(date).endOf("month").format("YYYY-MM-DD");
        const res = await api.get(`/calendar/events?start=${start}&end=${end}`);
        
        const formattedEvents = res.data.map((event) => ({
          ...event,
          start: new Date(event.start_datetime),
          end: event.end_datetime ? new Date(event.end_datetime) : new Date(event.start_datetime),
          title: event.title,
        }));
        
        setEvents(formattedEvents);
      } catch (err) {
        console.error("Erreur lors du chargement des événements:", err);
      }
    };

    fetchData();
  }, [date]);

  // Ajouter un nouvel événement
  const handleAddEvent = async () => {
    try {
      await api.post("/calendar/events", {
        title: newEvent.title,
        start_datetime: newEvent.start_datetime,
        end_datetime: newEvent.end_datetime,
        color: newEvent.color,
      });
      setShowModal(false);
      setNewEvent({ title: "", start_datetime: "", end_datetime: "", color: "#667eea" });
      
      // Recharger les événements
      const start = moment(date).startOf("month").format("YYYY-MM-DD");
      const end = moment(date).endOf("month").format("YYYY-MM-DD");
      const res = await api.get(`/calendar/events?start=${start}&end=${end}`);
      const formattedEvents = res.data.map((event) => ({
        ...event,
        start: new Date(event.start_datetime),
        end: event.end_datetime ? new Date(event.end_datetime) : new Date(event.start_datetime),
        title: event.title,
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Erreur lors de la création de l'événement:", err);
    }
  };

  // Modifier un événement (glisser-déposer ou redimensionner)
  const handleEventDrop = async ({ event, start, end }) => {
    try {
      await api.put(`/calendar/events/${event.id}`, {
        start_datetime: start.toISOString(),
        end_datetime: end.toISOString(),
      });
      
      // Recharger les événements
      const startDate = moment(date).startOf("month").format("YYYY-MM-DD");
      const endDate = moment(date).endOf("month").format("YYYY-MM-DD");
      const res = await api.get(`/calendar/events?start=${startDate}&end=${endDate}`);
      const formattedEvents = res.data.map((e) => ({
        ...e,
        start: new Date(e.start_datetime),
        end: e.end_datetime ? new Date(e.end_datetime) : new Date(e.start_datetime),
        title: e.title,
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
    }
  };

  // Supprimer un événement
  const handleEventDelete = async (event) => {
    if (window.confirm(`Voulez-vous supprimer "${event.title}" ?`)) {
      try {
        await api.delete(`/calendar/events/${event.id}`);
        
        // Recharger les événements
        const startDate = moment(date).startOf("month").format("YYYY-MM-DD");
        const endDate = moment(date).endOf("month").format("YYYY-MM-DD");
        const res = await api.get(`/calendar/events?start=${startDate}&end=${endDate}`);
        const formattedEvents = res.data.map((e) => ({
          ...e,
          start: new Date(e.start_datetime),
          end: e.end_datetime ? new Date(e.end_datetime) : new Date(e.start_datetime),
          title: e.title,
        }));
        setEvents(formattedEvents);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
      }
    }
  };

  // Style des événements
  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || "#667eea";
    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "none",
        display: "block",
      },
    };
  };

  // Créer un événement en cliquant sur un créneau
  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({
      ...newEvent,
      start_datetime: moment(start).format("YYYY-MM-DDTHH:mm"),
      end_datetime: moment(end).format("YYYY-MM-DDTHH:mm"),
    });
    setShowModal(true);
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Calendrier</h1>
        <div className="calendar-header-right">
          <button className="btn-new-event" onClick={() => {
            const now = new Date();
            setNewEvent({
              title: "",
              start_datetime: moment(now).format("YYYY-MM-DDTHH:mm"),
              end_datetime: moment(now).add(1, "hour").format("YYYY-MM-DDTHH:mm"),
              color: "#667eea",
            });
            setShowModal(true);
          }}>
            + Nouveau
          </button>
          <div className="calendar-controls">
            <button onClick={() => setView("month")} className={view === "month" ? "active" : ""}>
              Mois
            </button>
            <button onClick={() => setView("week")} className={view === "week" ? "active" : ""}>
              Semaine
            </button>
            <button onClick={() => setView("day")} className={view === "day" ? "active" : ""}>
              Jour
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventDrop}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => setSelectedEvent(event)}
          selectable
          resizable
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {/* Modal pour ajouter un événement */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-meeting" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouvelle réunion</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }}>
              <div className="form-group">
                <label>Sujet</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Titre de la réunion"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Début</label>
                  <input
                    type="datetime-local"
                    value={newEvent.start_datetime}
                    onChange={(e) => setNewEvent({ ...newEvent, start_datetime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fin</label>
                  <input
                    type="datetime-local"
                    value={newEvent.end_datetime}
                    onChange={(e) => setNewEvent({ ...newEvent, end_datetime: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Couleur</label>
                <div className="color-picker">
                  <button type="button" className={`color-btn ${newEvent.color === '#667eea' ? 'active' : ''}`} style={{background: '#667eea'}} onClick={() => setNewEvent({...newEvent, color: '#667eea'})}></button>
                  <button type="button" className={`color-btn ${newEvent.color === '#28a745' ? 'active' : ''}`} style={{background: '#28a745'}} onClick={() => setNewEvent({...newEvent, color: '#28a745'})}></button>
                  <button type="button" className={`color-btn ${newEvent.color === '#dc3545' ? 'active' : ''}`} style={{background: '#dc3545'}} onClick={() => setNewEvent({...newEvent, color: '#dc3545'})}></button>
                  <button type="button" className={`color-btn ${newEvent.color === '#ffc107' ? 'active' : ''}`} style={{background: '#ffc107'}} onClick={() => setNewEvent({...newEvent, color: '#ffc107'})}></button>
                  <button type="button" className={`color-btn ${newEvent.color === '#17a2b8' ? 'active' : ''}`} style={{background: '#17a2b8'}} onClick={() => setNewEvent({...newEvent, color: '#17a2b8'})}></button>
                </div>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Créer</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour voir les détails d'un événement */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEvent.title}</h2>
            <p>
              <strong>Début:</strong> {moment(selectedEvent.start).format("DD/MM/YYYY HH:mm")}
            </p>
            {selectedEvent.end && (
              <p>
                <strong>Fin:</strong> {moment(selectedEvent.end).format("DD/MM/YYYY HH:mm")}
              </p>
            )}
            <div className="modal-buttons">
              <button className="btn-danger" onClick={() => { handleEventDelete(selectedEvent); setSelectedEvent(null); }}>
                Supprimer
              </button>
              <button className="btn-secondary" onClick={() => setSelectedEvent(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}