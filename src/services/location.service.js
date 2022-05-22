class LocationService {
    isUnderMinThreshold(location) {
        return Object.keys(location._source.lo.thresholds).find((id) => {
            const min = location._source.lo.thresholds[id].min;
            return !!location._source.lo.stocks[id].find(
                (stock) => stock <   min
            );
        });
    }

    isAboveMaxThreshold(location) {
        return Object.keys(location._source.lo.thresholds).find((id) => {
            const max = location._source.lo.thresholds[id].max;
            return !!location._source.lo.stocks[id].find(
                (stock) => stock > max
            );
        });
    }

    isSeriesUnderTheshold(location, id) {
        const min = location._source.lo.thresholds[id].min;
        return !!location._source.lo.stocks[id].find((stock) => stock < min);
    }

    isSeriesAboveThreshold(location, id) {
        const max = location._source.lo.thresholds[id].max;
        return !!location._source.lo.stocks[id].find((stock) => stock > max);
    }

    getLocationColor(location, theme) {
        if (!!this.isUnderMinThreshold(location)) {
            return theme.palette.error.dark;
        } else if (!!this.isAboveMaxThreshold(location)) {
            return theme.palette.warning.dark;
        }
        return theme.palette.success.main;
    }
}

export default new LocationService();
