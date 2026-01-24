// components/CustomerAccountLayout.jsx
import React from "react";
import Footer from "../admin(demo)/components/footer";
import { Helmet } from "react-helmet-async";
import Header from "../admin(demo)/components/header";

const CustomerAccountLayout = ({ storeData, children, title }) => {
    const pageTitle = `${title} | ${storeData?.name ? (storeData.name + " Store").toUpperCase() : "STORE"}`;
    return (
        <>
        <Helmet>
            <title>{pageTitle}</title>
        </Helmet>

        <Header storeLogo={storeData?.logo?.url} storeName={storeData?.name}/>


        {/* Main Content Area */}
        <main style={{ minHeight: "60vh" }}>
            {children}
        </main>

        <Footer 
            storeName={storeData?.name} 
            storeLogo={storeData?.logo?.url} 
        />
        </>
    );
};

export default CustomerAccountLayout;