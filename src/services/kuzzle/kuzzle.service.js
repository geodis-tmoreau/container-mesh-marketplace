import kuzzle from ".";

class KuzzleService {
    // The Kuzzle Index
    index;

    async init(index) {
        this.index = index;
        const credentials = {
            username: process.env.REACT_APP_KUZZLE_API_USERNAME,
            password: process.env.REACT_APP_KUZZLE_API_PASSWORD,
        };

        await kuzzle.connect();
        await kuzzle.auth.login("local", credentials);
    }

    async disconnect() {
        await kuzzle.disconnect();
    }

    setIndex(index) {
        this.index = index;
    }

    getLocations() {
        return kuzzle.document.search(this.index, "locations");
    }

    getReplenishments() {
        return kuzzle.document.search(this.index, "replenishments");
    }

    getEvents() {
        return kuzzle.document.search(this.index, "events", {
            sort: { "event.eventCreatedDateTime": "asc" },
        });
    }

    getJitEvents() {
        return kuzzle.document.search(this.index, "jit-events", {
            sort: { eventCreatedDateTime: "asc" },
        });
    }

    getContainers() {
        return kuzzle.document.search(
            "usecase-2",
            "containers",
            {},
            {
                size: 50,
            }
        );
    }

    async getSessions() {
        const { result: availableSessions } = await kuzzle.query({
            controller: "step",
            action: "listSessions",
        });

        return availableSessions;
    }

    async getCurrentSession() {
        const { result: currentSession } = await kuzzle.query({
            controller: "step",
            action: "getSession",
        });

        return currentSession;
    }

    async startSession(session) {
        await kuzzle.query({
            controller: "step",
            action: "startSession",
            session
        });
    }

    putProposal(quantity, price) {
        return kuzzle.document.update(
            this.index,
            "replenishments",
            "msc-20p-rotterdam-week-4",
            {
                proposal: {
                    deliveryDate: {
                        proposed: "2022-01-29T00:00:00",
                    },
                    price,
                    provider: "CMA-CGM",
                    quantity,
                    status: "PROPOSAL",
                },
            }
        );
    }

    /**
     * For demo purpose, a replenishment has only one proposal, in real life you'd have many proposals, so you'd accept one specifically in this case
     * or multiples...
     *
     * @param {string} replenishment Accept the only replensihment proposal
     * @returns
     */
    acceptProposal(replenishment) {
        return kuzzle.document.update(
            this.index,
            "replenishments",
            replenishment,
            {
                proposal: {
                    /* There is actually 4 status, but for tiing purposes, we'll jump directly to the last status, which is COMPLETED
                     * - PROPOSAL
                     * - ACCEPTED
                     * - STARTED
                     * - COMPLETED
                     *
                     * We'll pre-recorded events.
                     */
                    status: "COMPLETED",
                },
            }
        );
    }

    reset() {
        return this.playStep(1);
    }

    playStep(stepIndex) {
        return kuzzle.query({
            controller: "step",
            action: "play",
            number: stepIndex,
            session: this.index.split("-").pop(),
        });
    }

    acceptForecastedReplenishment(replenishment, quantity) {
        return kuzzle.document.update(
            this.index,
            "replenishments",
            replenishment._id,
            {
                status: "CONFIRMED",
                quantity: quantity,
            }
        );
    }
}

export default new KuzzleService();
