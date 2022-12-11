export class ExperimentState {
    COMPrepared: boolean = false
    YAxisPrepared: boolean = false
    Started = false;

    public SetCOMPrepared(state: boolean) {
        this.COMPrepared = state
        return this
    }

    public IsReady() {
        return this.COMPrepared 
                && this.YAxisPrepared
                && !this.Started
    }

    public Start() {
        if (this.Started) 
            return false;

        this.Started = true;
        return true
    }
}
