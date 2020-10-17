//
//  MyCacheImageView.m
//  CacheImage
//

#import <UIKit/UIKit.h>

@interface MyCacheImageView : UIImageView {

}


- (void)setImageURL:(NSString *)URL ;

- (void)setImageURL:(NSString *)URL placeholderImage:(NSString *)imageName;

- (void)setImageURL:(NSString *)URL placeImage:(UIImage *)image;

@end
