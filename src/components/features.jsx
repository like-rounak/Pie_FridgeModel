import React from "react";
import { useNavigate } from "react-router-dom";

export const Features = () => {
    const navigate = useNavigate();
    const featuresData = [
        {
            icon: "fa fa-cutlery",
            title: "Personalized Recipe Recommendations",
            text: "Receive tailored recipe suggestions based on your preferences and available ingredients, simplifying meal planning.",
            onClick: () => navigate('/UploadForm')
        },
        {
            icon: "fa fa-truck",
            title: "Real-Time Inventory Tracking",
            text: "Stay updated on your food supplies with live monitoring, ensuring you never run out of essentials."
        },
        {
            icon: "fa fa-bell",
            title: "Expiration Date Alerts",
            text: " Get timely notifications when your items are nearing expiry, reducing food waste and optimizing freshness."
        },
        {
            icon: "fa fa-book",
            title: "Nutritional Information Access",
            text: "Access detailed nutritional data for stored items, empowering healthier food choices and informed meal preparation.",
            onClick: () => navigate('/Nutritional') 
        }
    ];

    return (
        <div id="features" className="text-center">
            <div className="container">
                <div className="col-md-10 col-md-offset-1 section-title" style={{ marginTop: '30px', marginBottom: '30px' }}>
                    <h2>Features</h2>
                </div>
                {featuresData.map((d, i) => (
                    <div key={`${d.title}-${i}`} className={`col-xs-6 col-md-3`} style={{ padding: '10px' }}>
                        <div 
                            onClick={d.onClick} 
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                padding: '20px',
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                cursor: d.onClick ? 'pointer' : 'default',
                                height: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onMouseEnter={(e) => {
                                if (d.onClick) {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                                    e.currentTarget.style.borderColor = '#007BFF';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (d.onClick) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.borderColor = '#ddd';
                                }
                            }}
                        >
                            <i className={d.icon} style={{ fontSize: '40px', color: '#007BFF', marginBottom: '15px' }}></i>
                            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{d.title}</h3>
                            <p style={{ fontSize: '14px', color: '#666', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{d.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;