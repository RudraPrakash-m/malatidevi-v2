import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Breadcrumb from "../Breadcrumb";
import { LayoutProvider } from "../LayoutContext";

interface MainLayoutProps {
    hideSidebar?: boolean;
}

const MainLayoutContent = ({ hideSidebar }: MainLayoutProps) => {
    const location = useLocation();
    const isPublicNoSidebar =
        location.pathname === "/add-wshg" ||
        location.pathname === "/track-wshg" ||
        location.pathname.startsWith("/track-wshg");
    const shouldHideSidebar = hideSidebar || isPublicNoSidebar;

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-transparent text-foreground">
            {/* Header */}
            <Header />

            <div className="flex min-h-0 flex-1 overflow-hidden">
                {/* Sidebar - hidden on /add-wshg */}
                {!shouldHideSidebar && <Sidebar />}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto bg-transparent p-3 md:p-5 transition-colors duration-200">
                        <div className={`${shouldHideSidebar ? "max-w-[1350px]" : "max-w-[1600px]"} mx-auto w-full`}>
                            {!shouldHideSidebar && <Breadcrumb />}
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

const MainLayout = ({ hideSidebar }: MainLayoutProps) => {
    return (
        <LayoutProvider>
            <MainLayoutContent hideSidebar={hideSidebar} />
        </LayoutProvider>
    );
};

export default MainLayout;