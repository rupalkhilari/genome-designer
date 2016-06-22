import Block from '../../models/Block';
import Project from '../../models/Project';
import rollupFromArray from './rollupFromArray';

export default function rollupWithConstruct(useClassless = false) {
  const construct = useClassless ? Block.classless() : new Block();
  const input = {
    components: [construct.id],
  };
  const project = useClassless ? Project.classless(input) : new Project(input);

  return rollupFromArray(project, construct);
}
