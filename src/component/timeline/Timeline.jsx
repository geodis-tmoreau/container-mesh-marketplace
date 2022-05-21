import moment from "moment";

import TimelineGroup from "./TimelineGroup";

/**
 *
 * @param {Object} param0
 * @param {import('component/timeline/TimelineGroup').Group[]} param0.groups
 * @param {import('component/timeline/TimelineGroup').TimelineEvent[]} param0.events
 */
const Timeline = ({ groups, events }) => {
  groups.forEach((group) => (group.events = []));

  events.forEach((event) => {
    const group = groups.find((group) =>
      moment(event.dateTime).isBetween(
        moment(group.departure.date).subtract(1, "s"),
        moment(group.arrival.date).add(1, "s")
      )
    );
    if (group) {
      group.events.push(event);
    }
  });


  return groups.map(
    (group) =>
      group.events.length > 0 && (
        <TimelineGroup group={group} key={group.name} />
      )
  );
};

export default Timeline;
