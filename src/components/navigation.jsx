import React from "react";
import { Link } from "react-router-dom";

export const Navigation = (props) => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top" style={{
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#333'
            }}
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar" style={{ backgroundColor: '#333' }}></span>{" "}
            <span className="icon-bar" style={{ backgroundColor: '#333' }}></span>{" "}
            <span className="icon-bar" style={{ backgroundColor: '#333' }}></span>{" "}
          </button>
          <Link className="navbar-brand page-scroll" to="/" style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#007BFF',
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}>
            Pie.ai 
          </Link>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right" style={{ margin: 0 }}>
            <li style={{ margin: '0 10px' }}>
              <a href="#features" className="page-scroll" style={{
                color: '#333',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '9px 15px',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#007BFF';
                e.target.style.color = '#fff';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
                e.target.style.transform = 'scale(1)';
              }}>
                Features
              </a>
            </li>
            <li style={{ margin: '0 10px' }}>
              <a href="#about" className="page-scroll" style={{
                color: '#333',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '9px 15px',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#007BFF';
                e.target.style.color = '#fff';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
                e.target.style.transform = 'scale(1)';
              }}>
                About
              </a>
            </li>
            <li style={{ margin: '0 10px' }}>
              <a href="#services" className="page-scroll" style={{
                color: '#333',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '9px 15px',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#007BFF';
                e.target.style.color = '#fff';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
                e.target.style.transform = 'scale(1)';
              }}>
                Services
              </a>
            </li>
            <li style={{ margin: '0 10px' }}>
              <a href="#team" className="page-scroll" style={{
                color: '#333',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '9px 15px',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#007BFF';
                e.target.style.color = '#fff';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
                e.target.style.transform = 'scale(1)';
              }}>
                Gallery
              </a>
            </li>
            <li style={{ margin: '0 10px' }}>
              <a href="#gallery" className="page-scroll" style={{
                color: '#333',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '9px 15px',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#007BFF';
                e.target.style.color = '#fff';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
                e.target.style.transform = 'scale(1)';
              }}>
                Team
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};