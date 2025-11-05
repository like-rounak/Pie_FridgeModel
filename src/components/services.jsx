import React from "react";

export const Services = (props) => {
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>
          Experience the future of kitchen management with our comprehensive suite of services, designed to streamline your tasks, minimize waste, and enhance your culinary experience effortlessly.
          </p>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4" style={{ padding: '10px' }}>
                  <div 
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      padding: '20px',
                      textAlign: 'center',
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      height: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className={d.icon} style={{ marginBottom: '15px', color: '#007BFF' }}></i>
                    <div className="service-desc">
                      <h3 style={{ color: '#333' }}>{d.name}</h3>
                      <p style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#666' }}>{d.text}</p>
                    </div>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
