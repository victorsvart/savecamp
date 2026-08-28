import * as React from "react";

export type ActivityStatus = "idle" | "active";

type ActivityState = {
  status: ActivityStatus;
  message: string;
};

type ActivityContextValue = ActivityState & {
  setActivity: (status: ActivityStatus, message?: string) => void;
  clearActivity: () => void;
};

const ActivityContext = React.createContext<ActivityContextValue | null>(null);

const idleState: ActivityState = {
  status: "idle",
  message: "Aguardando",
};

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activity, setActivityState] = React.useState<ActivityState>(idleState);

  const setActivity = React.useCallback(
    (status: ActivityStatus, message = "") => {
      setActivityState({ status, message });
    },
    []
  );

  const clearActivity = React.useCallback(() => {
    setActivityState(idleState);
  }, []);

  const value = React.useMemo(
    () => ({
      ...activity,
      setActivity,
      clearActivity,
    }),
    [activity, setActivity, clearActivity]
  );

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = React.useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider");
  }
  return context;
}
