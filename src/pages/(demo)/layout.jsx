// components/CustomerAccountLayout.jsx
import React from "react";
import Footer from "../admin(demo)/components/footer";
import { Helmet } from "react-helmet-async";
import Header from "../admin(demo)/components/header";

const CustomerAccountLayout = ({ storeData, children, title, storeSlug, isStarter }) => {
    const pageTitle = `${title} | ${storeData?.name ? (storeData.name + " Store").toUpperCase() : "STORE"}`;
    return (
        <>
        <Helmet>
            <title>{pageTitle}</title>
        </Helmet>

        <Header
                  storeName={storeData?.name}
                  storeLogo={storeData?.logo?.url}
                  storeSlug={storeSlug} // Pass the slug
                  isStarter={storeData?.plan === "starter"} // Pass the plan check
                />


        {/* Main Content Area */}
        <main style={{ minHeight: "60vh" }}>
            {children}
        </main>

        <Footer
          storeName={storeData?.name}
          storeDescription={storeData?.description}
          storeLogo={storeData?.logo?.url}
          storeId={storeData?._id}
          isStarter={storeData?.plan === "starter"}
          storeSlug={storeSlug}

        />
        </>
    );
};

export default CustomerAccountLayout;