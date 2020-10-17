//
//  DWPlayVideoVC.m
//  RCTAuroraIMUI
//
//  Created by Dowin on 2018/5/23.
//  Copyright © 2018年 HXHG. All rights reserved.
//

#import "DWPlayVideoVC.h"
#import <MediaPlayer/MediaPlayer.h>

#define screenW [UIScreen mainScreen].bounds.size.width
#define screenH [UIScreen mainScreen].bounds.size.height

@interface DWPlayVideoVC ()
@property (nonatomic, strong) MPMoviePlayerController *moviePlayer;
@property (strong, nonatomic) UIButton *playBtn;
@property (strong, nonatomic) UIButton *backBtn;
@end

@implementation DWPlayVideoVC

- (void)dealloc{
//    NSLog(@"dealloc---------------");
    [_moviePlayer stop];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self topStatusUIHidden:YES];
}

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self topStatusUIHidden:NO];
}

- (void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    [self setupBtn];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];

    self.playBtn = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 80, 80)];
    self.playBtn.center = CGPointMake(screenW *0.5, screenH * 0.5);
   
    NSString *strImgPath = [[NSBundle bundleForClass:[self class]] pathForResource:@"IMUIAssets.bundle/image/video_play_btn" ofType:@"png"];
    [self.playBtn setImage:[UIImage imageWithContentsOfFile:strImgPath] forState:UIControlStateNormal]; ;
    [self.playBtn addTarget:self action:@selector(clickPlayBtn) forControlEvents:UIControlEventTouchUpInside];
    self.playBtn.hidden = YES;
    [self.view addSubview:self.playBtn];
    
    self.backBtn = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 50, 40)];
    [self.backBtn setTitle:@"退出" forState:UIControlStateNormal];
    self.backBtn.titleLabel.font = [UIFont systemFontOfSize:20];
    [self.backBtn addTarget:self action:@selector(clickTapBackBtn) forControlEvents:UIControlEventTouchUpInside];
    
    if (self.strPath) {
        [self startPlay];
    }
}

- (void)clickPlayBtn{
    self.playBtn.hidden = YES;
    [self.moviePlayer play];
}

- (void)clickTapBackBtn{
    [_moviePlayer stop];
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (MPMoviePlayerController*)moviePlayer{
    if (!_moviePlayer){
        _moviePlayer = [[MPMoviePlayerController alloc] initWithContentURL:[NSURL fileURLWithPath:self.strPath]];
        _moviePlayer.controlStyle = MPMovieControlStyleEmbedded;
        _moviePlayer.scalingMode = MPMovieScalingModeAspectFill;
        _moviePlayer.fullscreen = YES;
    }
    return _moviePlayer;
}


- (void)startPlay{
    self.moviePlayer.view.frame = self.view.bounds;
    self.moviePlayer.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self.moviePlayer play];
    [self.view addSubview:self.moviePlayer.view];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(moviePlaybackComplete:)
                                                 name:MPMoviePlayerPlaybackDidFinishNotification
                                               object:self.moviePlayer];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(moviePlayerLoadStateDidChange:)
                                                 name:MPMoviePlayerLoadStateDidChangeNotification
                                               object:self.moviePlayer];
    
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(moviePlayStateChanged:)
                                                 name:MPMoviePlayerPlaybackStateDidChangeNotification
                                               object:self.moviePlayer];
    
    [self.view bringSubviewToFront:self.playBtn];
}


- (void)setupBtn{
    for (UIView *tmpView in [[self.moviePlayer.view.subviews firstObject].subviews firstObject].subviews) {
        if ([tmpView isKindOfClass:NSClassFromString(@"MPVideoPlaybackOverlayView")]) {
            tmpView.hidden = NO;
            tmpView.alpha = 1.0;
            for (UIView *tt in [tmpView.subviews lastObject].subviews) {
                for (UIButton *tmpBtn in tt.subviews) {
                    tmpBtn.hidden = NO;
                    tmpBtn.alpha = 1.0;
                    if ([tmpBtn isKindOfClass:NSClassFromString(@"MPKnockoutButton")] && (tmpBtn.frame.origin.x > screenW*0.5)) {
                        self.backBtn.center = tmpBtn.center;
                        tmpBtn.hidden = YES;
                        [tmpBtn.superview addSubview:self.backBtn];
                    }
                }
            }
        }
    }
}

- (void)moviePlayerLoadStateDidChange:(NSNotification *)aNotification{
    if (self.moviePlayer == aNotification.object)
    {
        switch (self.moviePlayer.loadState) {
            case MPMovieLoadStateUnknown:
                break;
            case MPMovieLoadStatePlayable:
                break;
            case MPMovieLoadStatePlaythroughOK:
                self.playBtn.hidden = YES;
//                NSLog(@"-------MPMovieLoadStatePlaythroughOK");
                [self setupBtn];
                break;
            case MPMovieLoadStateStalled:
                break;
            default:
                break;
        }
    }
}

- (void)moviePlaybackComplete: (NSNotification *)aNotification
{
    if (self.moviePlayer == aNotification.object)
    {
        self.playBtn.hidden = NO;
         [self setupBtn];
    }
}

- (void)moviePlayStateChanged: (NSNotification *)aNotification
{
    if (self.moviePlayer == aNotification.object)
    {
        switch (self.moviePlayer.playbackState)
        {
            case MPMoviePlaybackStatePlaying:
                [self topStatusUIHidden:YES];
                break;
            case MPMoviePlaybackStatePaused:
                [self.playBtn setHidden:NO];
                break;
            case MPMoviePlaybackStateStopped:
                break;
            case MPMoviePlaybackStateInterrupted:
                break;
            case MPMoviePlaybackStateSeekingBackward:
                break;
            case MPMoviePlaybackStateSeekingForward:
                break;
        }
    }
}


- (void)topStatusUIHidden:(BOOL)isHidden{
    [[UIApplication sharedApplication] setStatusBarHidden:isHidden];
    self.playBtn.hidden = isHidden;

}

@end
