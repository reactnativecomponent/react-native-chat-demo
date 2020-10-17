//
//  NIMEmoticonParser.m
//  NIMKit
//
//  Created by chris.
//  Copyright (c) 2015 Netease. All rights reserved.
//

#import "NIMInputEmoticonParser.h"
#import "NIMInputEmoticonManager.h"

#define UrlRegular @"((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[\\-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9\\.\\-]+|(?:www\\.|[\\-;:&=\\+\\$,\\w]+@)[A-Za-z0-9\\.\\-]+)((:[0-9]+)?)((?:\\/[\\+~%\\/\\.\\w\\-]*)?\\??(?:[\\-\\+=&;%@\\.\\w]*)#?(?:[\\.\\!\\/\\\\\\w]*))?)"
#define NumberRegular @"[0-9]{7,}"

@implementation NIMInputTextToken
@end

@interface NIMInputEmoticonParser ()
@property (nonatomic,strong)    NSCache *tokens;
@end


@implementation NIMInputEmoticonParser
+ (instancetype)currentParser
{
    static NIMInputEmoticonParser *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[NIMInputEmoticonParser alloc] init];
    });
    return instance;
}

- (instancetype)init
{
    if (self = [super init])
    {
        _tokens = [[NSCache alloc] init];
    }
    return self;
}

- (NSArray *)tokens:(NSString *)text
{
    NSArray *tokens = nil;
    if ([text length])
    {
        tokens = [_tokens objectForKey:text];
        if (tokens == nil)
        {
            tokens = [self getAllToken:text];
            [_tokens setObject:tokens
                        forKey:text];
        }
    }
    return tokens;
}

- (NSArray *)getAllToken:(NSString *)strText{
    NSMutableArray *tokens = [NSMutableArray array];
    NSArray *emoArr = [self parseEmoticonToken:strText];
    for (NIMInputTextToken *token in emoArr) {
        if (token.type == NIMInputTokenTypeEmoticon) {
            [tokens addObject:token];
        }else{
            NSArray *urlArr = [self parseUrlToken:token.text];
            for (NIMInputTextToken *urlToken in urlArr) {
                if (urlToken.type == NIMInputTokenTypeUrl) {
                    [tokens addObject:urlToken];
                }else{
                    NSArray *phoneArr = [self parseNumberToken:urlToken.text];
                    [tokens addObjectsFromArray:phoneArr];
                }
            }
        }
    }
    return tokens;
}

//获得表情
- (NSArray *)parseEmoticonToken:(NSString *)text
{
    NSMutableArray *emoTokens = [NSMutableArray array];
    
    NSRegularExpression *exp = [NSRegularExpression regularExpressionWithPattern:@"\\[[a-zA-Z0-9\\u4e00-\\u9fa5]+\\]"
                                                                         options:NSRegularExpressionCaseInsensitive
                                                                           error:nil];
    __block NSInteger index = 0;
    [exp enumerateMatchesInString:text
                          options:0
                            range:NSMakeRange(0, [text length])
                       usingBlock:^(NSTextCheckingResult *result, NSMatchingFlags flags, BOOL *stop) {
                           NSString *rangeText = [text substringWithRange:result.range];
                           if ([[NIMInputEmoticonManager sharedManager] emoticonByTag:rangeText])
                           {
                               if (result.range.location > index)
                               {
                                   NSString *rawText = [text substringWithRange:NSMakeRange(index, result.range.location - index)];
                                   NIMInputTextToken *token = [[NIMInputTextToken alloc] init];
                                   token.type = NIMInputTokenTypeText;
                                   token.text = rawText;
                                   [emoTokens addObject:token];
                               }
                               NIMInputTextToken *token = [[NIMInputTextToken alloc] init];
                               token.type = NIMInputTokenTypeEmoticon;
                               token.text = rangeText;
                               [emoTokens addObject:token];

                               index = result.range.location + result.range.length;
                           }
                       }];
    
    if (index < [text length])
    {
        NSString *rawText = [text substringWithRange:NSMakeRange(index, [text length] - index)];
        NIMInputTextToken *token = [[NIMInputTextToken alloc] init];
        token.type = NIMInputTokenTypeText;
        token.text = rawText;
        [emoTokens addObject:token];
    }
    return emoTokens;
}
//获得Url
- (NSArray *)parseUrlToken:(NSString *)text
{
    NSMutableArray *urlTokens = [NSMutableArray array];
    
    NSRegularExpression *exp = [NSRegularExpression regularExpressionWithPattern:UrlRegular options:NSRegularExpressionCaseInsensitive
                                                                           error:nil];
    __block NSInteger index = 0;
    [exp enumerateMatchesInString:text
                          options:0
                            range:NSMakeRange(0, [text length])
                       usingBlock:^(NSTextCheckingResult *result, NSMatchingFlags flags, BOOL *stop) {
                           NSString *rangeText = [text substringWithRange:result.range];
                           if (result.range.location > index)
                           {
                               NSString *rawText = [text substringWithRange:NSMakeRange(index, result.range.location - index)];
                               NIMInputTextToken *token = [[NIMInputTextToken alloc] init];
                               token.type = NIMInputTokenTypeText;
                               token.text = rawText;
                               [urlTokens addObject:token];
                           }
                           NIMInputTextToken *token = [[NIMInputTextToken alloc] init];
                           token.type = NIMInputTokenTypeUrl;
                           token.text = rangeText;
                           [urlTokens addObject:token];
                           
                           index = result.range.location + result.range.length;

                       }];
    
    if (index < [text length])
    {
        NSString *rawText = [text substringWithRange:NSMakeRange(index, [text length] - index)];
        NIMInputTextToken *token = [[NIMInputTextToken alloc] init];
        token.type = NIMInputTokenTypeText;
        token.text = rawText;
        [urlTokens addObject:token];
    }
    return urlTokens;
}
//获得数字
- (NSArray *)parseNumberToken:(NSString *)text
{
    NSMutableArray *numTokens = [NSMutableArray array];
    
    NSRegularExpression *exp = [NSRegularExpression regularExpressionWithPattern:NumberRegular options:NSRegularExpressionCaseInsensitive
                                                                           error:nil];
    __block NSInteger index = 0;
    [exp enumerateMatchesInString:text
                          options:0
                            range:NSMakeRange(0, [text length])
                       usingBlock:^(NSTextCheckingResult *result, NSMatchingFlags flags, BOOL *stop) {
                           NSString *rangeText = [text substringWithRange:result.range];
                           if (result.range.location > index)
                           {
                               NSString *rawText = [text substringWithRange:NSMakeRange(index, result.range.location - index)];
                               NIMInputTextToken *token = [[NIMInputTextToken alloc] init];
                               token.type = NIMInputTokenTypeText;
                               token.text = rawText;
                               [numTokens addObject:token];
                           }
                           NIMInputTextToken *token = [[NIMInputTextToken alloc] init];
                           token.type = NIMInputTokenTypeNumber;
                           token.text = rangeText;
                           [numTokens addObject:token];
                           
                           index = result.range.location + result.range.length;
                           
                       }];
    
    if (index < [text length])
    {
        NSString *rawText = [text substringWithRange:NSMakeRange(index, [text length] - index)];
        NIMInputTextToken *token = [[NIMInputTextToken alloc] init];
        token.type = NIMInputTokenTypeText;
        token.text = rawText;
        [numTokens addObject:token];
    }
    return numTokens;
}



@end
