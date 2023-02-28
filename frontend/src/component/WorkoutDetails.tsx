import React from "react";
import { deleteWorkout } from "../utils/workoutSlice";
import { useDispatch } from "react-redux";

export interface Data {
  title: string;
  _id: string;
  reps: number;
  load: number;
  createdAt: string;
}

const WorkoutDetails = ({ workout }: { workout: Data }) => {
  const dispatch = useDispatch();
  const handleClick = async () => {
    const response = await fetch("/api/workouts/" + workout._id, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      dispatch(deleteWorkout(json));
    }
  };

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p>
        <strong>Load (kg): </strong>
        {workout.load}
      </p>
      <p>
        <strong>Reps: </strong>
        {workout.reps}
      </p>
      <p>{workout.createdAt}</p>
      <span onClick={handleClick}>Delete</span>
    </div>
  );
};
export default WorkoutDetails;
