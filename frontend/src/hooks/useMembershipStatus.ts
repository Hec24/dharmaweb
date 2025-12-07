import { useState, useEffect } from "react";

interface MembershipStatus {
    isOpen: boolean;
    nextOpeningDate: string;
    currentPeriod: string;
    availableSpots?: number;
}

export const useMembershipStatus = () => {
    const [status, setStatus] = useState<MembershipStatus>({
        isOpen: false,
        nextOpeningDate: "2026-03-21",
        currentPeriod: "Q1 2026",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // TODO: Conectar con backend cuando esté disponible
                // const response = await fetch("/api/membership/status");
                // if (response.ok) {
                //   const data = await response.json();
                //   setStatus(data);
                // }

                // Por ahora, usar valores por defecto (inscripción cerrada)
                setStatus({
                    isOpen: false,
                    nextOpeningDate: "2026-03-21",
                    currentPeriod: "Q1 2026",
                });
            } catch (error) {
                console.error("Failed to fetch membership status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    return { ...status, loading };
};
