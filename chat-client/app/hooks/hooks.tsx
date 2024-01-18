import React from "react";

export function useSocket(url: string) {
    const [socket, setSocket] = React.useState<WebSocket | null>(null);
    React.useEffect(() => {
        const socket = new WebSocket(url, ['echo-protocol']);
        setSocket(socket);
        function cleanup() {
            if (socket) {
                socket.close()
            };
        };
        return cleanup
    }, [])

    return socket
}