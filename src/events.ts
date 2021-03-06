// DO NOT EDIT THIS FILE: THE BELOW IS AUTOGENERATED FROM HERE:
// https://github.com/sanbox-irl/gm-code-package-generator

export enum GmEvent {
    Create = 'Create',
    Destroy = 'Destroy',
    CleanUp = 'CleanUp',
    Step = 'Step',
    BeginStep = 'BeginStep',
    EndStep = 'EndStep',
    Alarm0 = 'Alarm0',
    Alarm1 = 'Alarm1',
    Alarm2 = 'Alarm2',
    Alarm3 = 'Alarm3',
    Alarm4 = 'Alarm4',
    Alarm5 = 'Alarm5',
    Alarm6 = 'Alarm6',
    Alarm7 = 'Alarm7',
    Alarm8 = 'Alarm8',
    Alarm9 = 'Alarm9',
    Alarm10 = 'Alarm10',
    Alarm11 = 'Alarm11',
    Draw = 'Draw',
    DrawBegin = 'DrawBegin',
    DrawEnd = 'DrawEnd',
    DrawGui = 'DrawGui',
    DrawGuiBegin = 'DrawGuiBegin',
    DrawGuiEnd = 'DrawGuiEnd',
    PreDraw = 'PreDraw',
    PostDraw = 'PostDraw',
    WindowResize = 'WindowResize',
    OutsideRoom = 'OutsideRoom',
    IntersectBoundary = 'IntersectBoundary',
    OutsideView0 = 'OutsideView0',
    OutsideView1 = 'OutsideView1',
    OutsideView2 = 'OutsideView2',
    OutsideView3 = 'OutsideView3',
    OutsideView4 = 'OutsideView4',
    OutsideView5 = 'OutsideView5',
    OutsideView6 = 'OutsideView6',
    OutsideView7 = 'OutsideView7',
    IntersectView0Boundary = 'IntersectView0Boundary',
    IntersectView1Boundary = 'IntersectView1Boundary',
    IntersectView2Boundary = 'IntersectView2Boundary',
    IntersectView3Boundary = 'IntersectView3Boundary',
    IntersectView4Boundary = 'IntersectView4Boundary',
    IntersectView5Boundary = 'IntersectView5Boundary',
    IntersectView6Boundary = 'IntersectView6Boundary',
    IntersectView7Boundary = 'IntersectView7Boundary',
    GameStart = 'GameStart',
    GameEnd = 'GameEnd',
    RoomStart = 'RoomStart',
    RoomEnd = 'RoomEnd',
    AnimationEnd = 'AnimationEnd',
    AnimationUpdate = 'AnimationUpdate',
    AnimationEvent = 'AnimationEvent',
    PathEnded = 'PathEnded',
    UserEvent0 = 'UserEvent0',
    UserEvent1 = 'UserEvent1',
    UserEvent2 = 'UserEvent2',
    UserEvent3 = 'UserEvent3',
    UserEvent4 = 'UserEvent4',
    UserEvent5 = 'UserEvent5',
    UserEvent6 = 'UserEvent6',
    UserEvent7 = 'UserEvent7',
    UserEvent8 = 'UserEvent8',
    UserEvent9 = 'UserEvent9',
    UserEvent10 = 'UserEvent10',
    UserEvent11 = 'UserEvent11',
    UserEvent12 = 'UserEvent12',
    UserEvent13 = 'UserEvent13',
    UserEvent14 = 'UserEvent14',
    UserEvent15 = 'UserEvent15',
    BroadcastMessage = 'BroadcastMessage',
    AsyncAudioPlayback = 'AsyncAudioPlayback',
    AsyncAudioRecording = 'AsyncAudioRecording',
    AsyncCloud = 'AsyncCloud',
    AsyncDialog = 'AsyncDialog',
    AsyncHttp = 'AsyncHttp',
    AsyncInAppPurchase = 'AsyncInAppPurchase',
    AsyncImageLoaded = 'AsyncImageLoaded',
    AsyncNetworking = 'AsyncNetworking',
    AsyncPushNotification = 'AsyncPushNotification',
    AsyncSaveLoad = 'AsyncSaveLoad',
    AsyncSocial = 'AsyncSocial',
    AsyncSteam = 'AsyncSteam',
    AsyncSystem = 'AsyncSystem',
}

export function ev_to_fname(gm_e: GmEvent): string {
    switch (gm_e) {
        case GmEvent.Create:
            return 'Create_0';
        case GmEvent.Destroy:
            return 'Destroy_0';
        case GmEvent.CleanUp:
            return 'CleanUp_0';
        case GmEvent.Step:
            return 'Step_0';
        case GmEvent.BeginStep:
            return 'Step_1';
        case GmEvent.EndStep:
            return 'Step_2';
        case GmEvent.Alarm0:
            return 'Alarm_0';
        case GmEvent.Alarm1:
            return 'Alarm_1';
        case GmEvent.Alarm2:
            return 'Alarm_2';
        case GmEvent.Alarm3:
            return 'Alarm_3';
        case GmEvent.Alarm4:
            return 'Alarm_4';
        case GmEvent.Alarm5:
            return 'Alarm_5';
        case GmEvent.Alarm6:
            return 'Alarm_6';
        case GmEvent.Alarm7:
            return 'Alarm_7';
        case GmEvent.Alarm8:
            return 'Alarm_8';
        case GmEvent.Alarm9:
            return 'Alarm_9';
        case GmEvent.Alarm10:
            return 'Alarm_10';
        case GmEvent.Alarm11:
            return 'Alarm_11';
        case GmEvent.Draw:
            return 'Draw_0';
        case GmEvent.DrawBegin:
            return 'Draw_72';
        case GmEvent.DrawEnd:
            return 'Draw_73';
        case GmEvent.DrawGui:
            return 'Draw_64';
        case GmEvent.DrawGuiBegin:
            return 'Draw_74';
        case GmEvent.DrawGuiEnd:
            return 'Draw_75';
        case GmEvent.PreDraw:
            return 'Draw_76';
        case GmEvent.PostDraw:
            return 'Draw_77';
        case GmEvent.WindowResize:
            return 'Draw_65';
        case GmEvent.OutsideRoom:
            return 'Other_0';
        case GmEvent.IntersectBoundary:
            return 'Other_1';
        case GmEvent.OutsideView0:
            return 'Other_40';
        case GmEvent.OutsideView1:
            return 'Other_41';
        case GmEvent.OutsideView2:
            return 'Other_42';
        case GmEvent.OutsideView3:
            return 'Other_43';
        case GmEvent.OutsideView4:
            return 'Other_44';
        case GmEvent.OutsideView5:
            return 'Other_45';
        case GmEvent.OutsideView6:
            return 'Other_46';
        case GmEvent.OutsideView7:
            return 'Other_47';
        case GmEvent.IntersectView0Boundary:
            return 'Other_50';
        case GmEvent.IntersectView1Boundary:
            return 'Other_51';
        case GmEvent.IntersectView2Boundary:
            return 'Other_52';
        case GmEvent.IntersectView3Boundary:
            return 'Other_53';
        case GmEvent.IntersectView4Boundary:
            return 'Other_54';
        case GmEvent.IntersectView5Boundary:
            return 'Other_55';
        case GmEvent.IntersectView6Boundary:
            return 'Other_56';
        case GmEvent.IntersectView7Boundary:
            return 'Other_57';
        case GmEvent.GameStart:
            return 'Other_2';
        case GmEvent.GameEnd:
            return 'Other_3';
        case GmEvent.RoomStart:
            return 'Other_4';
        case GmEvent.RoomEnd:
            return 'Other_5';
        case GmEvent.AnimationEnd:
            return 'Other_7';
        case GmEvent.AnimationUpdate:
            return 'Other_58';
        case GmEvent.AnimationEvent:
            return 'Other_59';
        case GmEvent.PathEnded:
            return 'Other_8';
        case GmEvent.UserEvent0:
            return 'Other_10';
        case GmEvent.UserEvent1:
            return 'Other_11';
        case GmEvent.UserEvent2:
            return 'Other_12';
        case GmEvent.UserEvent3:
            return 'Other_13';
        case GmEvent.UserEvent4:
            return 'Other_14';
        case GmEvent.UserEvent5:
            return 'Other_15';
        case GmEvent.UserEvent6:
            return 'Other_16';
        case GmEvent.UserEvent7:
            return 'Other_17';
        case GmEvent.UserEvent8:
            return 'Other_18';
        case GmEvent.UserEvent9:
            return 'Other_19';
        case GmEvent.UserEvent10:
            return 'Other_20';
        case GmEvent.UserEvent11:
            return 'Other_21';
        case GmEvent.UserEvent12:
            return 'Other_22';
        case GmEvent.UserEvent13:
            return 'Other_23';
        case GmEvent.UserEvent14:
            return 'Other_24';
        case GmEvent.UserEvent15:
            return 'Other_25';
        case GmEvent.BroadcastMessage:
            return 'Other_76';
        case GmEvent.AsyncAudioPlayback:
            return 'Other_74';
        case GmEvent.AsyncAudioRecording:
            return 'Other_73';
        case GmEvent.AsyncCloud:
            return 'Other_67';
        case GmEvent.AsyncDialog:
            return 'Other_63';
        case GmEvent.AsyncHttp:
            return 'Other_62';
        case GmEvent.AsyncInAppPurchase:
            return 'Other_66';
        case GmEvent.AsyncImageLoaded:
            return 'Other_60';
        case GmEvent.AsyncNetworking:
            return 'Other_68';
        case GmEvent.AsyncPushNotification:
            return 'Other_71';
        case GmEvent.AsyncSaveLoad:
            return 'Other_72';
        case GmEvent.AsyncSocial:
            return 'Other_70';
        case GmEvent.AsyncSteam:
            return 'Other_69';
        case GmEvent.AsyncSystem:
            return 'Other_75';
    }
}

export function fname_to_ev(fname: string): GmEvent | undefined {
    switch (fname) {
        case 'Create_0':
            return GmEvent.Create;
        case 'Destroy_0':
            return GmEvent.Destroy;
        case 'CleanUp_0':
            return GmEvent.CleanUp;
        case 'Step_0':
            return GmEvent.Step;
        case 'Step_1':
            return GmEvent.BeginStep;
        case 'Step_2':
            return GmEvent.EndStep;
        case 'Alarm_0':
            return GmEvent.Alarm0;
        case 'Alarm_1':
            return GmEvent.Alarm1;
        case 'Alarm_2':
            return GmEvent.Alarm2;
        case 'Alarm_3':
            return GmEvent.Alarm3;
        case 'Alarm_4':
            return GmEvent.Alarm4;
        case 'Alarm_5':
            return GmEvent.Alarm5;
        case 'Alarm_6':
            return GmEvent.Alarm6;
        case 'Alarm_7':
            return GmEvent.Alarm7;
        case 'Alarm_8':
            return GmEvent.Alarm8;
        case 'Alarm_9':
            return GmEvent.Alarm9;
        case 'Alarm_10':
            return GmEvent.Alarm10;
        case 'Alarm_11':
            return GmEvent.Alarm11;
        case 'Draw_0':
            return GmEvent.Draw;
        case 'Draw_72':
            return GmEvent.DrawBegin;
        case 'Draw_73':
            return GmEvent.DrawEnd;
        case 'Draw_64':
            return GmEvent.DrawGui;
        case 'Draw_74':
            return GmEvent.DrawGuiBegin;
        case 'Draw_75':
            return GmEvent.DrawGuiEnd;
        case 'Draw_76':
            return GmEvent.PreDraw;
        case 'Draw_77':
            return GmEvent.PostDraw;
        case 'Draw_65':
            return GmEvent.WindowResize;
        case 'Other_0':
            return GmEvent.OutsideRoom;
        case 'Other_1':
            return GmEvent.IntersectBoundary;
        case 'Other_40':
            return GmEvent.OutsideView0;
        case 'Other_41':
            return GmEvent.OutsideView1;
        case 'Other_42':
            return GmEvent.OutsideView2;
        case 'Other_43':
            return GmEvent.OutsideView3;
        case 'Other_44':
            return GmEvent.OutsideView4;
        case 'Other_45':
            return GmEvent.OutsideView5;
        case 'Other_46':
            return GmEvent.OutsideView6;
        case 'Other_47':
            return GmEvent.OutsideView7;
        case 'Other_50':
            return GmEvent.IntersectView0Boundary;
        case 'Other_51':
            return GmEvent.IntersectView1Boundary;
        case 'Other_52':
            return GmEvent.IntersectView2Boundary;
        case 'Other_53':
            return GmEvent.IntersectView3Boundary;
        case 'Other_54':
            return GmEvent.IntersectView4Boundary;
        case 'Other_55':
            return GmEvent.IntersectView5Boundary;
        case 'Other_56':
            return GmEvent.IntersectView6Boundary;
        case 'Other_57':
            return GmEvent.IntersectView7Boundary;
        case 'Other_2':
            return GmEvent.GameStart;
        case 'Other_3':
            return GmEvent.GameEnd;
        case 'Other_4':
            return GmEvent.RoomStart;
        case 'Other_5':
            return GmEvent.RoomEnd;
        case 'Other_7':
            return GmEvent.AnimationEnd;
        case 'Other_58':
            return GmEvent.AnimationUpdate;
        case 'Other_59':
            return GmEvent.AnimationEvent;
        case 'Other_8':
            return GmEvent.PathEnded;
        case 'Other_10':
            return GmEvent.UserEvent0;
        case 'Other_11':
            return GmEvent.UserEvent1;
        case 'Other_12':
            return GmEvent.UserEvent2;
        case 'Other_13':
            return GmEvent.UserEvent3;
        case 'Other_14':
            return GmEvent.UserEvent4;
        case 'Other_15':
            return GmEvent.UserEvent5;
        case 'Other_16':
            return GmEvent.UserEvent6;
        case 'Other_17':
            return GmEvent.UserEvent7;
        case 'Other_18':
            return GmEvent.UserEvent8;
        case 'Other_19':
            return GmEvent.UserEvent9;
        case 'Other_20':
            return GmEvent.UserEvent10;
        case 'Other_21':
            return GmEvent.UserEvent11;
        case 'Other_22':
            return GmEvent.UserEvent12;
        case 'Other_23':
            return GmEvent.UserEvent13;
        case 'Other_24':
            return GmEvent.UserEvent14;
        case 'Other_25':
            return GmEvent.UserEvent15;
        case 'Other_76':
            return GmEvent.BroadcastMessage;
        case 'Other_74':
            return GmEvent.AsyncAudioPlayback;
        case 'Other_73':
            return GmEvent.AsyncAudioRecording;
        case 'Other_67':
            return GmEvent.AsyncCloud;
        case 'Other_63':
            return GmEvent.AsyncDialog;
        case 'Other_62':
            return GmEvent.AsyncHttp;
        case 'Other_66':
            return GmEvent.AsyncInAppPurchase;
        case 'Other_60':
            return GmEvent.AsyncImageLoaded;
        case 'Other_68':
            return GmEvent.AsyncNetworking;
        case 'Other_71':
            return GmEvent.AsyncPushNotification;
        case 'Other_72':
            return GmEvent.AsyncSaveLoad;
        case 'Other_70':
            return GmEvent.AsyncSocial;
        case 'Other_69':
            return GmEvent.AsyncSteam;
        case 'Other_75':
            return GmEvent.AsyncSystem;
        default:
            return undefined;
    }
}
