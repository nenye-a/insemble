import { objectType } from 'nexus';

export let LocationPreviewResult = objectType({
  name: 'LocationPreviewResult',
  definition(t) {
    t.string('targetAddress');
    t.string('targetNeighborhood', { nullable: true });
    t.float('daytimePop3Mile');
    t.float('medianIncome');
    t.int('medianAge');
  },
});
