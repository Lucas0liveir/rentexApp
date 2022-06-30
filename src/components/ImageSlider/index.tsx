import React, { useRef, useState } from 'react';
import { FlatList, ViewToken } from 'react-native';

import {
    Container,
    ImageIndexes,
    ImageIndex,
    CarImageWrapper,
    CarImage,
} from './styles';

interface Props {
    imageUrl: string[]
}

interface ChangeImageProps {
    viewableItems: ViewToken[];
    changed: ViewToken[];
}

export function ImageSlider({ imageUrl }: Props) {
    const [imageIndex, setImageIndex] = useState(0)

    const indexChanged = useRef((info: ChangeImageProps) => {
        setImageIndex(info.viewableItems[0].index)
    })

    return (
        <Container>
            <ImageIndexes>
                {imageUrl.map((_, index) => (
                    <ImageIndex key={index} active={imageIndex === index} />
                ))

                }
            </ImageIndexes>

            <FlatList
                data={imageUrl}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <CarImageWrapper>
                        <CarImage
                            source={{ uri: item }}
                            resizeMode="contain"
                        />
                    </CarImageWrapper>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={indexChanged.current}
            />



        </Container>
    );
}