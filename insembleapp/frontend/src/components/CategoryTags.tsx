import React from 'react';
import styled, {css} from 'styled-components';
import {PRIMARY, LIGHTEST_GREY, GREY, LIGHT_GREY} from "../constants/colors";

type Props = {
    allCategories: Array<String>;
    selectedCategories: Array<String>;
};

const Pill = styled.div`
    flex: 1 1 auto;
    margin-right: .25rem;
    margin-bottom: .5rem;
    padding: 0.375rem 0.5rem;
    font-size: 75%;
    line-height: 1;

    text-align: center;
    text-transform: uppercase;

    border: 1px solid;
    border-radius: 0.375rem;
    border-color: ${LIGHT_GREY};

    background: ${LIGHTEST_GREY};
    color: ${GREY};

    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;

    &:hover {
        color: ${PRIMARY};
        border-color: ${PRIMARY};
        box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.075)
    }

    ${
        // @ts-ignore // TODO: type for props?
        props => props.primary && css`
        background: ${PRIMARY};
        color: ${LIGHTEST_GREY};
        border-radius: 0;
    `}
`;

export default (props: Props) => {
    let {allCategories, selectedCategories} = props;
    console.log(props);
    return (
        <>
            {/*<div>*/}
            {/*    {selectedCategories.map((item, idx) => {*/}
            {/*        return (<Pill key={idx}>{item}</Pill>);*/}
            {/*    })}*/}
            {/*</div>*/}
            {/*<div>*/}
                {allCategories.map((item, idx) => {
                    return (<Pill key={idx}>{item}</Pill>);
                })}
            {/*</div>*/}
        </>
    )
};
