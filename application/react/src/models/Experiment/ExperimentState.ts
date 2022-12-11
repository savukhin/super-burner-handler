export interface IPositions {
    x1_end: number
    x2_end: number
    y_start: number
}

export class ExperimentState {
    COMPrepared: boolean = false
    YAxisPrepared: boolean = false
    YAxisEndPosition: number = 0
    positions?: IPositions
    Started = false;

    public SetCOMPrepared(state: boolean) {
        this.COMPrepared = state
        return this
    }

    public SetYAxisEndPositionn(position: number) {
        this.YAxisEndPosition = position
        this.YAxisPrepared = true
        return this
    }

    public SetPositions(positions: IPositions) {
        this.positions = positions
    }

    public IsReady() {
        return this.COMPrepared 
                // && this.YAxisPrepared
                && !this.Started
                && this.positions
    }

    public Start() {
        if (this.Started) 
            return false;

        this.Started = true;
        return true
    }
}
