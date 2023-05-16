export interface IPosition {
    x: number
    y: number
}

export interface IPositions {
    x1_start: number
    x2_end: number
    y_start: number
    y_end: number
}

export class ExperimentState {
    COMPrepared: boolean = false
    YAxisPrepared: boolean = false
    YAxisEndPosition: number = 0
    positions: IPositions = { x1_start: 0, x2_end: 0, y_start: 0, y_end: 0 }
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

    public IsReadyToStart() {
        return this.COMPrepared 
                // && this.YAxisPrepared
                && !this.Started
    }

    public IsReady() {
        return this.COMPrepared 
                // && this.YAxisPrepared
    }

    public Start() {
        if (this.Started) 
            return false;

        this.Started = true;
        return true
    }

    public Finish() {
        if (!this.Started) 
            return false;

        this.Started = false;
        return true
    }
}
