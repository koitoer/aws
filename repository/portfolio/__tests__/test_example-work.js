import React from 'react';
import { shallow } from 'enzyme';
import ExampleWork , {ExampleWorkBubble} from '../js/example-work'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

const myWork = [
  {
    'title' : "Work Example",
    'image' : {
        'description' : "example screenshot of a project involving code",
        'src' : "images/example1.png",
        'comment' : ""
    }
  },
  {
    'title' : "Portfolio BoilerPlate",
    'image' : {
        'description' : "example screenshot of a project involving chemistry",
        'src' : "images/example2.png",
        'comment' : ""
    }
  }];

describe("ExampleWork, component", () => {

  let component = shallow(<ExampleWork work={myWork} />);

  it("Should be a 'section' element", () => {
      console.log(component.debug());
      expect(component.type()).toEqual('section');
  });

  it("Should contain as many exampleas as there in work examples", () => {
      expect(component.find('ExampleWorkBubble').length).toEqual(myWork.length);
  });
})

describe("ExampleWork, component", () => {

  let component = shallow(<ExampleWorkBubble example={myWork[1]} />);
  let images = component.find("img");

  it("Should contain a single img", () => {
      expect(images.length).toEqual(1);
  });

  it("Should img set correctly", () => {
      expect(images.prop('src')).toEqual(myWork[1].image.src);
  });
})
