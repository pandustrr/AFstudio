import { router } from "@inertiajs/react";

export const trackInteraction = ({
    event_type,
    page_name,
    item_id,
    item_name,
    payload = {},
}) => {
    // Send tracking data to backend
    fetch("/api/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content"),
        },
        body: JSON.stringify({
            event_type,
            page_name,
            url: window.location.href,
            item_id,
            item_name,
            payload,
        }),
    }).catch((err) => console.error("Tracking failed:", err));
};

export const trackPageView = (pageName) => {
    trackInteraction({
        event_type: "page_view",
        page_name: pageName,
    });
};
