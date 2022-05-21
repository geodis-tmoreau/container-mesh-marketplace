import kuzzle from ".";

class KuzzleService {

  // The Kuzzle Index
  index

  async init(index) {
    this.index = index
    const credentials = {
      username: process.env.REACT_APP_KUZZLE_API_USERNAME,
      password: process.env.REACT_APP_KUZZLE_API_PASSWORD
    };

    await kuzzle.connect();
    await kuzzle.auth.login("local", credentials)
    // await this.playStep(1)
  }

  getLocations() {
    return kuzzle.document.search(this.index, "locations")
  }

  getReplenishments() {
    return kuzzle.document.search(this.index, "replenishments")
  }

  getEvents() {
    return kuzzle.document.search(
      this.index,
      'events',
      {
        sort: { 'event.eventCreatedDateTime': 'asc' }
      });
  }

  getJitEvents() {
    return kuzzle.document.search(
      this.index,
      'jit-events',
      {
        sort: { 'eventCreatedDateTime': 'asc' }
      });
    }

  putProposal(quantity, price) {
    return kuzzle.document.update(this.index, "replenishments", "msc-20p-rotterdam-week-4", {
      proposal: {
        deliveryDate: {
          proposed: "2022-01-29T00:00:00"
        },
        price,
        provider: "CMA-CGM",
        quantity,
        status: "PROPOSAL"
      },
    })
  }

  reset() {
    return this.playStep(1)
  }

  playStep(stepIndex) {
    return kuzzle.query({ controller: "step", action: "play", number: stepIndex, session: this.index.split('-').pop() })
  }

  acceptForecastedReplenishment(replenishment, quantity) {
    return kuzzle.document.update(this.index, "replenishments", replenishment._id, {
      status: "CONFIRMED",
      quantity: quantity
    })
  }
}


export default new KuzzleService();